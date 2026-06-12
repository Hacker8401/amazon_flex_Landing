import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createLead } from "./db";
import { sendLeadNotificationEmail } from "./email";

export const appRouter = router({
  leads: router({
    submit: publicProcedure
      .input(
        z.object({
          name: z.string().min(1, "Name is required"),
          phone: z.string().min(10, "Valid phone number required"),
          city: z.string().min(1, "City is required"),
          vehicleType: z.string().min(1, "Vehicle type is required"),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const lead = await createLead({
            name: input.name,
            phone: input.phone,
            city: input.city,
            vehicleType: input.vehicleType,
          });

          if (lead) {
            // Send email notification to admin
            try {
              await sendLeadNotificationEmail({
                name: input.name,
                phone: input.phone,
                city: input.city,
                vehicleType: input.vehicleType,
              });
            } catch (emailError) {
              console.warn("Failed to send email notification:", emailError);
              // Don't fail the lead submission if email fails
            }
          }

          return { success: true, lead };
        } catch (error) {
          console.error("Failed to submit lead:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to submit application",
          });
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;

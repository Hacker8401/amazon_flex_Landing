import nodemailer from "nodemailer";

interface LeadNotification {
  name: string;
  phone: string;
  city: string;
  vehicleType: string;
}

// Create transporter - configure based on your email service
// For development/testing, you can use Ethereal Email (fake SMTP)
// For production, use SendGrid, Gmail, or other services

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;

  const emailService = process.env.EMAIL_SERVICE || "gmail";
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASSWORD;
  const adminEmail = process.env.ADMIN_EMAIL || emailUser;

  if (!emailUser || !emailPass) {
    console.warn("Email credentials not configured. Notifications will be logged only.");
    return null;
  }

  if (emailService === "gmail") {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPass, // Use App Password for Gmail
      },
    });
  } else if (emailService === "sendgrid") {
    // For SendGrid, use SMTP
    transporter = nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 587,
      auth: {
        user: "apikey",
        pass: emailPass, // SendGrid API key
      },
    });
  } else {
    // Generic SMTP
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });
  }

  return transporter;
}

export async function sendLeadNotificationEmail(lead: LeadNotification) {
  const transporter = getTransporter();
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

  if (!transporter || !adminEmail) {
    console.log("Email notification (logged only):", lead);
    return;
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: adminEmail,
      subject: `New Amazon Flex Application - ${lead.name}`,
      html: `
        <h2>New Amazon Flex Lead Submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(lead.name)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(lead.phone)}</p>
        <p><strong>City:</strong> ${escapeHtml(lead.city)}</p>
        <p><strong>Vehicle Type:</strong> ${escapeHtml(lead.vehicleType)}</p>
        <p><strong>Submitted at:</strong> ${new Date().toLocaleString()}</p>
        <hr />
        <p>Please follow up with this applicant to complete their onboarding.</p>
      `,
      text: `
New Amazon Flex Lead Submission

Name: ${lead.name}
Phone: ${lead.phone}
City: ${lead.city}
Vehicle Type: ${lead.vehicleType}
Submitted at: ${new Date().toLocaleString()}

Please follow up with this applicant to complete their onboarding.
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email notification sent to ${adminEmail} for lead: ${lead.name}`);
  } catch (error) {
    console.error("Failed to send email notification:", error);
    throw error;
  }
}

// Helper function to escape HTML
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

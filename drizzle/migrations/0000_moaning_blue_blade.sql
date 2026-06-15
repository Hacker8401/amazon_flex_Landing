CREATE TABLE "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"city" varchar(100) NOT NULL,
	"vehicle_type" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

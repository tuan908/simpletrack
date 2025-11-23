CREATE TYPE "public"."note_type" AS ENUM('Call', 'Email', 'Meeting', 'Note');--> statement-breakpoint
CREATE TABLE "note" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content" text NOT NULL,
	"type" "note_type" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"contact_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "t_contact" ALTER COLUMN "id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "note" ADD CONSTRAINT "note_contact_id_t_contact_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."t_contact"("id") ON DELETE cascade ON UPDATE no action;
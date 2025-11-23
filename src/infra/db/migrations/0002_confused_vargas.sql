CREATE TABLE "t_note" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"type" "note_type" NOT NULL,
	"contact_id" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_by" text,
	"updated_by" text,
	"deleted_by" text,
	"version" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
DROP TABLE "note" CASCADE;--> statement-breakpoint
ALTER TABLE "t_note" ADD CONSTRAINT "t_note_contact_id_t_contact_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."t_contact"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_deleted_at_t_note" ON "t_note" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "idx_created_at_t_note" ON "t_note" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_created_by_at_t_note" ON "t_note" USING btree ("created_by","created_at");
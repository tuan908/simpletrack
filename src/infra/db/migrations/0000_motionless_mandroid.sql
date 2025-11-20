CREATE TABLE "t_contact" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255),
	"phone" varchar(50),
	"company" varchar(255),
	"status" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_by" text,
	"updated_by" text,
	"deleted_by" text,
	"version" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_deleted_at_t_contact" ON "t_contact" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "idx_created_at_t_contact" ON "t_contact" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_created_by_at_t_contact" ON "t_contact" USING btree ("created_by","created_at");
CREATE TYPE "public"."activity_enum" AS ENUM('sedentary', 'light', 'moderate', 'active', 'very_active');--> statement-breakpoint
CREATE TYPE "public"."goal_enum" AS ENUM('lose', 'maintain', 'gain');--> statement-breakpoint
CREATE TYPE "public"."sex_enum" AS ENUM('male', 'female', 'other');--> statement-breakpoint
CREATE TYPE "public"."metric_source_enum" AS ENUM('manual', 'device');--> statement-breakpoint
CREATE TYPE "public"."unit_enum" AS ENUM('metric', 'imperial');--> statement-breakpoint
CREATE TABLE "body_metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"at" timestamp DEFAULT now() NOT NULL,
	"weight_kg" numeric(5, 2),
	"body_fat_pct" numeric(5, 2),
	"resting_hr" integer,
	"source" "metric_source_enum" DEFAULT 'manual' NOT NULL,
	"note" varchar(256)
);
--> statement-breakpoint
CREATE TABLE "user_goals" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"type" "goal_enum" NOT NULL,
	"target_weight_kg" numeric(5, 2),
	"weekly_rate_kg" numeric(4, 3),
	"start_date" date DEFAULT now() NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"user_id" integer NOT NULL,
	"height_cm" integer,
	"weight_kg" numeric(5, 2),
	"birth_date" date,
	"sex" "sex_enum",
	"activity_level" "activity_enum" DEFAULT 'sedentary' NOT NULL,
	"unit_system" "unit_enum" DEFAULT 'metric' NOT NULL,
	"timezone" varchar(128),
	"locale" varchar(16),
	"notify_enabled" boolean DEFAULT true NOT NULL,
	"notify_prefs" jsonb DEFAULT '{"steps":true,"meals":true,"workouts":true,"tips":true}'::jsonb,
	"ai_avatar_seed" varchar(128),
	CONSTRAINT "user_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "body_metrics" ADD CONSTRAINT "body_metrics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_goals" ADD CONSTRAINT "user_goals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "body_metrics_user_at_idx" ON "body_metrics" USING btree ("user_id","at");--> statement-breakpoint
CREATE UNIQUE INDEX "user_active_goal_idx" ON "user_goals" USING btree ("user_id","is_active");
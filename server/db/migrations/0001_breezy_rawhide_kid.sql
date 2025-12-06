CREATE TABLE "tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" text NOT NULL,
	"user_id" text NOT NULL,
	"bucket_id" text NOT NULL,
	"name" text NOT NULL,
	"color" text NOT NULL,
	"start_date_time" timestamp with time zone DEFAULT now(),
	"end_date_time" timestamp with time zone DEFAULT now(),
	"notes" text NOT NULL,
	CONSTRAINT "tasks_task_id_unique" UNIQUE("task_id"),
	CONSTRAINT "tasks_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "todos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"title" varchar(500) NOT NULL,
	"subtitle" varchar(500),
	"description" varchar(1000),
	"completed" boolean DEFAULT false,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "todos" ADD CONSTRAINT "todos_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
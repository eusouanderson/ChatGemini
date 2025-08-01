ALTER TABLE "messages" ALTER COLUMN "timestamp" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "tokens_used" SET NOT NULL;
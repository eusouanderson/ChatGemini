CREATE TABLE "messages" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "messages_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"role" varchar(50) NOT NULL,
	"content" varchar(10000) NOT NULL,
	"timestamp" integer NOT NULL,
	"tokens_used" integer
);

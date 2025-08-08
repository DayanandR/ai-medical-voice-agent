CREATE TABLE "payment_audit" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "payment_audit_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"paymentId" integer,
	"event" varchar(100) NOT NULL,
	"oldStatus" varchar(50),
	"newStatus" varchar(50),
	"eventData" jsonb,
	"createdAt" timestamp DEFAULT now(),
	"adminUser" varchar(100),
	"ipAddress" varchar(45),
	"userAgent" text
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "payments_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"paymentId" varchar(100) NOT NULL,
	"phone" varchar(15) NOT NULL,
	"planId" varchar(50) NOT NULL,
	"planName" varchar(100),
	"amount" integer NOT NULL,
	"paymentProofPath" text,
	"transactionNote" varchar(255),
	"status" varchar(50) DEFAULT 'pending',
	"createdAt" timestamp DEFAULT now(),
	"verifiedAt" timestamp,
	"verifiedBy" varchar(100),
	"rejectionReason" text,
	"notes" text,
	"upiTransactionId" varchar(100),
	"paymentApp" varchar(50),
	CONSTRAINT "payments_paymentId_unique" UNIQUE("paymentId")
);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "credits" SET DEFAULT 5;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "subscriptionPlan" SET DEFAULT 'free';--> statement-breakpoint
ALTER TABLE "payment_audit" ADD CONSTRAINT "payment_audit_paymentId_payments_id_fk" FOREIGN KEY ("paymentId") REFERENCES "public"."payments"("id") ON DELETE no action ON UPDATE no action;
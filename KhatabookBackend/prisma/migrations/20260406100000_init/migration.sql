-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('GAVE', 'GOT');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'SENT', 'PAID', 'CANCELLED');

-- CreateEnum
CREATE TYPE "StockMovementType" AS ENUM ('IN', 'OUT', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "ReminderType" AS ENUM ('WHATSAPP', 'SMS', 'EMAIL');

-- CreateEnum
CREATE TYPE "ReminderStatus" AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'FAILED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'UPI', 'CARD', 'NETBANKING', 'CHEQUE');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'RESTORE');

-- CreateEnum
CREATE TYPE "SyncStatus" AS ENUM ('PENDING', 'SYNCED', 'CONFLICT', 'FAILED');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "phone_number" VARCHAR(15) NOT NULL,
    "phone_verified" BOOLEAN NOT NULL DEFAULT false,
    "name" VARCHAR(255),
    "email" VARCHAR(255),
    "language_code" VARCHAR(10) NOT NULL DEFAULT 'en',
    "profile_image_url" TEXT,
    "biometric_enabled" BOOLEAN NOT NULL DEFAULT false,
    "pin_hash" VARCHAR(255),
    "last_login_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "device_id" VARCHAR(255) NOT NULL,
    "device_type" VARCHAR(50) NOT NULL,
    "device_name" VARCHAR(255),
    "refresh_token_hash" VARCHAR(255) NOT NULL,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "last_activity_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked_at" TIMESTAMP(3),

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "khatabooks" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "business_name" VARCHAR(255),
    "business_type" VARCHAR(100),
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "currency_code" VARCHAR(3) NOT NULL DEFAULT 'INR',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "khatabooks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" UUID NOT NULL,
    "khatabook_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "phone_number" VARCHAR(15),
    "email" VARCHAR(255),
    "address" TEXT,
    "gstin" VARCHAR(15),
    "opening_balance" INTEGER NOT NULL DEFAULT 0,
    "current_balance" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "last_transaction_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" UUID NOT NULL,
    "khatabook_id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "note" TEXT,
    "transaction_date" TIMESTAMP(3) NOT NULL,
    "payment_mode" VARCHAR(50),
    "invoice_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction_attachments" (
    "id" UUID NOT NULL,
    "transaction_id" UUID NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_type" VARCHAR(50) NOT NULL,
    "file_size" INTEGER,
    "thumbnail_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transaction_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" UUID NOT NULL,
    "khatabook_id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "invoice_number" VARCHAR(50) NOT NULL,
    "invoice_date" DATE NOT NULL,
    "due_date" DATE,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
    "subtotal" INTEGER NOT NULL,
    "tax_amount" INTEGER NOT NULL DEFAULT 0,
    "total_amount" INTEGER NOT NULL,
    "notes" TEXT,
    "is_gst_invoice" BOOLEAN NOT NULL DEFAULT false,
    "pdf_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_items" (
    "id" UUID NOT NULL,
    "invoice_id" UUID NOT NULL,
    "inventory_item_id" UUID,
    "item_name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "quantity" DECIMAL(10,2) NOT NULL DEFAULT 1.00,
    "unit" VARCHAR(50),
    "rate" INTEGER NOT NULL,
    "tax_rate" DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    "tax_amount" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL,
    "hsn_code" VARCHAR(20),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoice_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_settings" (
    "id" UUID NOT NULL,
    "khatabook_id" UUID NOT NULL,
    "business_name" VARCHAR(255),
    "business_address" TEXT,
    "business_phone" VARCHAR(15),
    "business_email" VARCHAR(255),
    "gstin" VARCHAR(15),
    "logo_url" TEXT,
    "invoice_prefix" VARCHAR(20) NOT NULL DEFAULT 'INV',
    "next_invoice_number" INTEGER NOT NULL DEFAULT 1,
    "terms_and_conditions" TEXT,
    "bank_details" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoice_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_items" (
    "id" UUID NOT NULL,
    "khatabook_id" UUID NOT NULL,
    "item_name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "sku" VARCHAR(100),
    "barcode" VARCHAR(100),
    "unit" VARCHAR(50) NOT NULL DEFAULT 'pcs',
    "purchase_price" INTEGER,
    "selling_price" INTEGER NOT NULL,
    "current_stock" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "min_stock_level" DECIMAL(10,2),
    "hsn_code" VARCHAR(20),
    "tax_rate" DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    "image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_logs" (
    "id" UUID NOT NULL,
    "inventory_item_id" UUID NOT NULL,
    "type" "StockMovementType" NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL,
    "balance_after" DECIMAL(10,2) NOT NULL,
    "reason" VARCHAR(255),
    "reference_id" UUID,
    "reference_type" VARCHAR(50),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stock_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reminder_logs" (
    "id" UUID NOT NULL,
    "khatabook_id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "type" "ReminderType" NOT NULL,
    "message" TEXT NOT NULL,
    "status" "ReminderStatus" NOT NULL,
    "balance_at_send" INTEGER NOT NULL,
    "provider_message_id" VARCHAR(255),
    "error_message" TEXT,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delivered_at" TIMESTAMP(3),

    CONSTRAINT "reminder_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL,
    "khatabook_id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "invoice_id" UUID,
    "amount" INTEGER NOT NULL,
    "gateway" VARCHAR(50) NOT NULL,
    "payment_method" VARCHAR(50),
    "gateway_payment_id" VARCHAR(255),
    "gateway_order_id" VARCHAR(255),
    "status" "PaymentStatus" NOT NULL,
    "payment_link" TEXT,
    "paid_at" TIMESTAMP(3),
    "failed_reason" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "khatabook_id" UUID,
    "entity_type" VARCHAR(100) NOT NULL,
    "entity_id" UUID NOT NULL,
    "action" "AuditAction" NOT NULL,
    "changed_fields" JSONB,
    "old_values" JSONB,
    "new_values" JSONB,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "device_id" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sync_metadata" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "device_id" VARCHAR(255) NOT NULL,
    "entity_type" VARCHAR(100) NOT NULL,
    "entity_id" UUID NOT NULL,
    "operation" "AuditAction" NOT NULL,
    "local_timestamp" TIMESTAMP(3) NOT NULL,
    "server_timestamp" TIMESTAMP(3),
    "sync_status" "SyncStatus" NOT NULL DEFAULT 'PENDING',
    "version" INTEGER NOT NULL DEFAULT 1,
    "conflict_data" JSONB,
    "retry_count" INTEGER NOT NULL DEFAULT 0,
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "synced_at" TIMESTAMP(3),

    CONSTRAINT "sync_metadata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_number_key" ON "users"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "sessions_user_id_device_id_idx" ON "sessions"("user_id", "device_id");

-- CreateIndex
CREATE INDEX "sessions_refresh_token_hash_idx" ON "sessions"("refresh_token_hash");

-- CreateIndex
CREATE INDEX "khatabooks_user_id_idx" ON "khatabooks"("user_id");

-- CreateIndex
CREATE INDEX "khatabooks_user_id_is_default_idx" ON "khatabooks"("user_id", "is_default");

-- CreateIndex
CREATE INDEX "customers_khatabook_id_idx" ON "customers"("khatabook_id");

-- CreateIndex
CREATE INDEX "customers_phone_number_idx" ON "customers"("phone_number");

-- CreateIndex
CREATE INDEX "customers_current_balance_idx" ON "customers"("current_balance");

-- CreateIndex
CREATE INDEX "customers_khatabook_id_current_balance_idx" ON "customers"("khatabook_id", "current_balance" DESC);

-- CreateIndex
CREATE INDEX "transactions_khatabook_id_idx" ON "transactions"("khatabook_id");

-- CreateIndex
CREATE INDEX "transactions_customer_id_idx" ON "transactions"("customer_id");

-- CreateIndex
CREATE INDEX "transactions_transaction_date_idx" ON "transactions"("transaction_date");

-- CreateIndex
CREATE INDEX "transactions_customer_id_transaction_date_idx" ON "transactions"("customer_id", "transaction_date" DESC);

-- CreateIndex
CREATE INDEX "transactions_khatabook_id_transaction_date_idx" ON "transactions"("khatabook_id", "transaction_date" DESC);

-- CreateIndex
CREATE INDEX "transaction_attachments_transaction_id_idx" ON "transaction_attachments"("transaction_id");

-- CreateIndex
CREATE INDEX "invoices_khatabook_id_idx" ON "invoices"("khatabook_id");

-- CreateIndex
CREATE INDEX "invoices_customer_id_idx" ON "invoices"("customer_id");

-- CreateIndex
CREATE INDEX "invoices_invoice_date_idx" ON "invoices"("invoice_date");

-- CreateIndex
CREATE INDEX "invoices_status_idx" ON "invoices"("status");

-- CreateIndex
CREATE UNIQUE INDEX "idx_invoices_number_unique" ON "invoices"("khatabook_id", "invoice_number");

-- CreateIndex
CREATE INDEX "invoice_items_invoice_id_idx" ON "invoice_items"("invoice_id");

-- CreateIndex
CREATE INDEX "invoice_items_inventory_item_id_idx" ON "invoice_items"("inventory_item_id");

-- CreateIndex
CREATE UNIQUE INDEX "invoice_settings_khatabook_id_key" ON "invoice_settings"("khatabook_id");

-- CreateIndex
CREATE INDEX "inventory_items_khatabook_id_idx" ON "inventory_items"("khatabook_id");

-- CreateIndex
CREATE INDEX "inventory_items_sku_idx" ON "inventory_items"("sku");

-- CreateIndex
CREATE INDEX "inventory_items_barcode_idx" ON "inventory_items"("barcode");

-- CreateIndex
CREATE INDEX "inventory_items_current_stock_idx" ON "inventory_items"("current_stock");

-- CreateIndex
CREATE INDEX "stock_logs_inventory_item_id_idx" ON "stock_logs"("inventory_item_id");

-- CreateIndex
CREATE INDEX "stock_logs_created_at_idx" ON "stock_logs"("created_at");

-- CreateIndex
CREATE INDEX "reminder_logs_customer_id_idx" ON "reminder_logs"("customer_id");

-- CreateIndex
CREATE INDEX "reminder_logs_sent_at_idx" ON "reminder_logs"("sent_at");

-- CreateIndex
CREATE INDEX "reminder_logs_status_idx" ON "reminder_logs"("status");

-- CreateIndex
CREATE UNIQUE INDEX "payments_gateway_payment_id_key" ON "payments"("gateway_payment_id");

-- CreateIndex
CREATE INDEX "payments_customer_id_idx" ON "payments"("customer_id");

-- CreateIndex
CREATE INDEX "payments_invoice_id_idx" ON "payments"("invoice_id");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "audit_logs_entity_type_entity_id_idx" ON "audit_logs"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "audit_logs_khatabook_id_idx" ON "audit_logs"("khatabook_id");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "sync_metadata_user_id_device_id_idx" ON "sync_metadata"("user_id", "device_id");

-- CreateIndex
CREATE INDEX "sync_metadata_entity_type_entity_id_idx" ON "sync_metadata"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "sync_metadata_sync_status_idx" ON "sync_metadata"("sync_status");

-- CreateIndex
CREATE INDEX "sync_metadata_local_timestamp_idx" ON "sync_metadata"("local_timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "sync_metadata_device_id_entity_type_entity_id_local_timesta_key" ON "sync_metadata"("device_id", "entity_type", "entity_id", "local_timestamp");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "khatabooks" ADD CONSTRAINT "khatabooks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_khatabook_id_fkey" FOREIGN KEY ("khatabook_id") REFERENCES "khatabooks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_khatabook_id_fkey" FOREIGN KEY ("khatabook_id") REFERENCES "khatabooks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_attachments" ADD CONSTRAINT "transaction_attachments_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_khatabook_id_fkey" FOREIGN KEY ("khatabook_id") REFERENCES "khatabooks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_inventory_item_id_fkey" FOREIGN KEY ("inventory_item_id") REFERENCES "inventory_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_settings" ADD CONSTRAINT "invoice_settings_khatabook_id_fkey" FOREIGN KEY ("khatabook_id") REFERENCES "khatabooks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_khatabook_id_fkey" FOREIGN KEY ("khatabook_id") REFERENCES "khatabooks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_logs" ADD CONSTRAINT "stock_logs_inventory_item_id_fkey" FOREIGN KEY ("inventory_item_id") REFERENCES "inventory_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reminder_logs" ADD CONSTRAINT "reminder_logs_khatabook_id_fkey" FOREIGN KEY ("khatabook_id") REFERENCES "khatabooks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reminder_logs" ADD CONSTRAINT "reminder_logs_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_khatabook_id_fkey" FOREIGN KEY ("khatabook_id") REFERENCES "khatabooks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_khatabook_id_fkey" FOREIGN KEY ("khatabook_id") REFERENCES "khatabooks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sync_metadata" ADD CONSTRAINT "sync_metadata_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;


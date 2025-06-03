-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('cash', 'card');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'cash';

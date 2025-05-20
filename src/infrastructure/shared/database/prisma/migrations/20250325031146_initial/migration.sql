/*
  Warnings:

  - You are about to alter the column `total` on the `TB_ORDERS` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `price` on the `TB_PRODUCTS` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - Added the required column `updatedAt` to the `TB_CLIENTS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `TB_ORDERS` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TB_CLIENTS" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "TB_ORDERS" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "total" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "TB_PRODUCTS" ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2);

-- CreateIndex
CREATE INDEX "TB_CLIENTS_cpf_idx" ON "TB_CLIENTS"("cpf");

-- CreateIndex
CREATE INDEX "TB_ORDERS_clientId_status_idx" ON "TB_ORDERS"("clientId", "status");

-- CreateIndex
CREATE INDEX "TB_PRODUCTS_category_idx" ON "TB_PRODUCTS"("category");

-- CreateIndex
CREATE INDEX "TB_PRODUCTS_ORDERS_orderId_idx" ON "TB_PRODUCTS_ORDERS"("orderId");

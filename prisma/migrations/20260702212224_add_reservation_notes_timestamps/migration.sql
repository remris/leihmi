/*
  Warnings:

  - The values [PENDING,CONFIRMED,CANCELLED] on the enum `BookingRequestStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `adminNotes` on the `BookingRequest` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `BookingRequest` table. All the data in the column will be lost.
  - You are about to drop the column `customerCompany` on the `BookingRequest` table. All the data in the column will be lost.
  - You are about to drop the column `customerEmail` on the `BookingRequest` table. All the data in the column will be lost.
  - You are about to drop the column `customerPhone` on the `BookingRequest` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryFee` on the `BookingRequest` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `BookingRequest` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `BookingRequest` table. All the data in the column will be lost.
  - You are about to drop the column `itemName` on the `BookingRequest` table. All the data in the column will be lost.
  - You are about to drop the column `itemPrice` on the `BookingRequest` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `BookingRequest` table. All the data in the column will be lost.
  - You are about to drop the column `postalCode` on the `BookingRequest` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `BookingRequest` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `BookingRequest` table. All the data in the column will be lost.
  - You are about to drop the column `street` on the `BookingRequest` table. All the data in the column will be lost.
  - You are about to drop the column `totalPrice` on the `BookingRequest` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BookingRequestStatus_new" AS ENUM ('OPEN', 'IN_PROGRESS', 'CONVERTED', 'REJECTED');
ALTER TABLE "BookingRequest" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "BookingRequest" ALTER COLUMN "status" TYPE "BookingRequestStatus_new" USING ("status"::text::"BookingRequestStatus_new");
ALTER TYPE "BookingRequestStatus" RENAME TO "BookingRequestStatus_old";
ALTER TYPE "BookingRequestStatus_new" RENAME TO "BookingRequestStatus";
DROP TYPE "BookingRequestStatus_old";
ALTER TABLE "BookingRequest" ALTER COLUMN "status" SET DEFAULT 'OPEN';
COMMIT;

-- DropIndex
DROP INDEX "BookingRequest_customerEmail_idx";

-- DropIndex
DROP INDEX "BookingRequest_status_idx";

-- AlterTable
ALTER TABLE "BookingRequest" DROP COLUMN "adminNotes",
DROP COLUMN "city",
DROP COLUMN "customerCompany",
DROP COLUMN "customerEmail",
DROP COLUMN "customerPhone",
DROP COLUMN "deliveryFee",
DROP COLUMN "endDate",
DROP COLUMN "itemId",
DROP COLUMN "itemName",
DROP COLUMN "itemPrice",
DROP COLUMN "notes",
DROP COLUMN "postalCode",
DROP COLUMN "quantity",
DROP COLUMN "startDate",
DROP COLUMN "street",
DROP COLUMN "totalPrice",
ADD COLUMN     "email" TEXT,
ADD COLUMN     "message" TEXT,
ADD COLUMN     "phone" TEXT,
ALTER COLUMN "status" SET DEFAULT 'OPEN';

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "city" TEXT,
ADD COLUMN     "company" TEXT;

-- AlterTable
ALTER TABLE "InventoryItem" ADD COLUMN     "available" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "minRentalDays" INTEGER,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

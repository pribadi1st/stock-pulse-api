/*
  Warnings:

  - You are about to drop the column `avg_price` on the `portfolios` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `transactions` table. All the data in the column will be lost.
  - Added the required column `avgPrice` to the `portfolios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "delisted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "portfolios" DROP COLUMN "avg_price",
ADD COLUMN     "avgPrice" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "date";

/*
  Warnings:

  - You are about to drop the column `avgPrice` on the `portfolios` table. All the data in the column will be lost.
  - Added the required column `avg_price` to the `portfolios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "portfolios" DROP COLUMN "avgPrice",
ADD COLUMN     "avg_price" DOUBLE PRECISION NOT NULL;

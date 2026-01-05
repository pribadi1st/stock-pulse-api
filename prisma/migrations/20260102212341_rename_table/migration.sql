/*
  Warnings:

  - You are about to drop the column `displaySymbol` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `marketCapitalization` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `shareOutstanding` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `webUrl` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `epsActual` on the `earnings_calendar` table. All the data in the column will be lost.
  - You are about to drop the column `epsEstimate` on the `earnings_calendar` table. All the data in the column will be lost.
  - You are about to drop the column `revenueActual` on the `earnings_calendar` table. All the data in the column will be lost.
  - You are about to drop the column `revenueEstimate` on the `earnings_calendar` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `portfolios` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `watchlists` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,symbol]` on the table `portfolios` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,symbol]` on the table `watchlists` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `display_symbol` to the `companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `portfolios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `watchlists` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "portfolios" DROP CONSTRAINT "portfolios_userId_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_userId_fkey";

-- DropForeignKey
ALTER TABLE "watchlists" DROP CONSTRAINT "watchlists_userId_fkey";

-- DropIndex
DROP INDEX "portfolios_userId_symbol_key";

-- DropIndex
DROP INDEX "watchlists_userId_symbol_key";

-- AlterTable
ALTER TABLE "companies" DROP COLUMN "displaySymbol",
DROP COLUMN "marketCapitalization",
DROP COLUMN "shareOutstanding",
DROP COLUMN "webUrl",
ADD COLUMN     "display_symbol" TEXT NOT NULL,
ADD COLUMN     "market_capitalization" DOUBLE PRECISION,
ADD COLUMN     "share_outstanding" DOUBLE PRECISION,
ADD COLUMN     "web_url" TEXT;

-- AlterTable
ALTER TABLE "earnings_calendar" DROP COLUMN "epsActual",
DROP COLUMN "epsEstimate",
DROP COLUMN "revenueActual",
DROP COLUMN "revenueEstimate",
ADD COLUMN     "eps_actual" DOUBLE PRECISION,
ADD COLUMN     "eps_estimate" DOUBLE PRECISION,
ADD COLUMN     "revenue_actual" BIGINT,
ADD COLUMN     "revenue_estimate" BIGINT;

-- AlterTable
ALTER TABLE "portfolios" DROP COLUMN "userId",
ADD COLUMN     "user_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "userId",
ADD COLUMN     "user_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "watchlists" DROP COLUMN "userId",
ADD COLUMN     "user_id" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "portfolios_user_id_symbol_key" ON "portfolios"("user_id", "symbol");

-- CreateIndex
CREATE UNIQUE INDEX "watchlists_user_id_symbol_key" ON "watchlists"("user_id", "symbol");

-- AddForeignKey
ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "watchlists" ADD CONSTRAINT "watchlists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

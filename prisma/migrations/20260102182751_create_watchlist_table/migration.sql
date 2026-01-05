-- DropForeignKey
ALTER TABLE "portfolios" DROP CONSTRAINT "portfolios_symbol_fkey";

-- AlterTable
ALTER TABLE "portfolios" ALTER COLUMN "quantity" DROP DEFAULT;

-- CreateTable
CREATE TABLE "watchlists" (
    "id" SERIAL NOT NULL,
    "userId" UUID NOT NULL,
    "symbol" TEXT NOT NULL,

    CONSTRAINT "watchlists_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "watchlists_userId_symbol_key" ON "watchlists"("userId", "symbol");

-- AddForeignKey
ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "companies"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "watchlists" ADD CONSTRAINT "watchlists_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "watchlists" ADD CONSTRAINT "watchlists_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "companies"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;

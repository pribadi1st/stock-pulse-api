-- DropIndex
DROP INDEX "news_symbol_headline_key";

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "fee" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "news_symbol_headline_idx" ON "news"("symbol", "headline");

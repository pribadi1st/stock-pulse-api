/*
  Warnings:

  - A unique constraint covering the columns `[symbol,headline]` on the table `news` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "news_symbol_finnhub_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "news_symbol_headline_key" ON "news"("symbol", "headline");

-- CreateTable
CREATE TABLE "news" (
    "id" SERIAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "category" TEXT,
    "datetime" TIMESTAMP(3) NOT NULL,
    "headline" TEXT NOT NULL,
    "finnhub_id" INTEGER,
    "image" TEXT,
    "source" TEXT,
    "summary" TEXT,
    "url" TEXT,

    CONSTRAINT "news_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "news_symbol_finnhub_id_key" ON "news"("symbol", "finnhub_id");

-- AddForeignKey
ALTER TABLE "news" ADD CONSTRAINT "news_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "companies"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;

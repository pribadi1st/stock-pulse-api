-- CreateTable
CREATE TABLE "EarningsCalendar" (
    "id" SERIAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "epsActual" DOUBLE PRECISION,
    "epsEstimate" DOUBLE PRECISION,
    "hour" TEXT,
    "quarter" INTEGER,
    "revenueActual" BIGINT,
    "revenueEstimate" BIGINT,
    "year" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EarningsCalendar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EarningsCalendar_symbol_date_key" ON "EarningsCalendar"("symbol", "date");

-- AddForeignKey
ALTER TABLE "EarningsCalendar" ADD CONSTRAINT "EarningsCalendar_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "Companies"("symbol") ON DELETE RESTRICT ON UPDATE CASCADE;

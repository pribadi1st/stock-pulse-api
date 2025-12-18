-- CreateTable
CREATE TABLE "EarningsCalendar" (
    "id" SERIAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "epsActual" INTEGER NOT NULL,
    "epsEstimate" INTEGER NOT NULL,
    "hour" TEXT NOT NULL,
    "quarter" INTEGER NOT NULL,
    "revenueActual" BIGINT NOT NULL,
    "revenueEstimate" BIGINT NOT NULL,
    "year" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EarningsCalendar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Industries" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Industries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Companies" (
    "id" SERIAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displaySymbol" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "figi" TEXT NOT NULL,
    "mic" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "country" TEXT,
    "exchange" TEXT,
    "ipo" TIMESTAMP(3),
    "marketCapitalization" BIGINT,
    "shareOutstanding" BIGINT,
    "phone" TEXT,
    "webUrl" TEXT,
    "logo" TEXT,
    "industryId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Companies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Companies_symbol_key" ON "Companies"("symbol");

-- AddForeignKey
ALTER TABLE "Companies" ADD CONSTRAINT "Companies_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "Industries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCompanyDto {
    @IsNotEmpty()
    @IsString()
    symbol: string;

    @IsString()
    displaySymbol: string;

    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    currency: string;

    @IsString()
    @IsOptional()
    figi: string;

    @IsString()
    @IsOptional()
    type: string;

    @IsString()
    @IsOptional()
    mic: string;

    @IsString()
    @IsOptional()
    country: string | null;

    @IsString()
    @IsOptional()
    exchange: string | null;

    @IsDateString()
    @IsOptional()
    ipo: Date | null;

    @IsNumber()
    @IsOptional()
    marketCapitalization: number | null;

    @IsNumber()
    @IsOptional()
    shareOutstanding: bigint | null;

    @IsString()
    @IsOptional()
    phone: string | null;

    @IsString()
    @IsOptional()
    webUrl: string | null;

    @IsString()
    @IsOptional()
    logo: string | null;
}
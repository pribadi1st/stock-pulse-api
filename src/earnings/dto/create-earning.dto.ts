import { IsString, IsOptional, IsNumber } from "class-validator";

export class CreateEarningDto {
    @IsString()
    symbol: string;

    @IsString()
    date: string;

    @IsNumber()
    @IsOptional()
    epsActual: number;

    @IsNumber()
    @IsOptional()
    epsEstimate: number;

    @IsString()
    @IsOptional()
    hour: string;

    @IsNumber()
    @IsOptional()
    quarter: number;

    @IsNumber()
    @IsOptional()
    revenueActual: number;

    @IsNumber()
    @IsOptional()
    revenueEstimate: number;

    @IsNumber()
    @IsOptional()
    year: number;
}

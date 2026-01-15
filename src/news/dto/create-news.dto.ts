import { IsDate, IsDateString, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateNewsDto {
    @IsString()
    @IsOptional()
    symbol: string;


    @IsString()
    @IsOptional()
    category?: string

    @IsDate()
    datetime: Date

    @IsString()
    headline: string

    @IsNumber()
    @IsOptional()
    finnhubID?: number

    @IsOptional()
    @IsString()
    image?: string

    @IsString()
    @IsOptional()
    source?: string

    @IsString()
    @IsOptional()
    summary?: string

    @IsString()
    @IsOptional()
    url?: string
}

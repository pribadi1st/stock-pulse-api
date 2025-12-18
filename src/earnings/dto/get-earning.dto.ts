import { IsDate, IsOptional, IsString } from "class-validator";
import { IsGreaterThanEqualFrom, IsNotBeforeThisMonth } from "../validator/earning.validator";
import { Type } from "class-transformer";

export class GetEarningDto {
    @IsString()
    @IsOptional()
    symbol?: string;

    @IsDate()
    @IsNotBeforeThisMonth()
    @Type(() => Date)
    from: string;

    @IsDate()
    @IsGreaterThanEqualFrom(['from'])
    @Type(() => Date)
    to: string;
}
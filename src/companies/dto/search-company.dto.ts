import { IsNumber, IsOptional, IsString } from "class-validator";


export class SearchCompanyDto {
    @IsString()
    @IsOptional()
    keyword: string | null;


    @IsNumber()
    @IsOptional()
    page: number | null;

    @IsNumber()
    @IsOptional()
    limit: number | null;
}
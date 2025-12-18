import { IsNotEmpty, IsString } from "class-validator";

export class CreateCompanyDto {
    @IsNotEmpty()
    @IsString()
    symbol: string;
    displaySymbol: string;

    @IsString()
    name: string;
    currency: string;
    figi: string;
    type: string;
    mic: string;
    //     symbol String @unique
    //   name String
    //   displaySymbol String
    //   currency String
    //   figi String
    //   mic String
    //   type String
    //   country String
    //   exchange String
    //   ipo DateTime
    //   marketCapitalization BigInt
    //   shareOutstanding BigInt
    //   phone String
    //   webUrl String
    //   logo String
    //   industry Industry? @relation(fields: [industryId], references: [id])
    //   industryId Int?
}

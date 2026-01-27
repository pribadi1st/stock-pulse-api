import { IsEnum, IsNumber, IsString } from "class-validator";
import { TransactionType } from "../../../types/transaction";

export class CreateTransactionDto {
    @IsString()
    symbol: string;

    @IsEnum(TransactionType, {
        message: "type must be either BUY or SELL"
    })
    type: TransactionType;

    @IsNumber()
    quantity: number;
    @IsNumber()
    price: number;
    @IsNumber()
    fee: number;
}
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";

import { User } from "../../users/entities/user.entity";
import { TransactionType } from "types/transaction";

@Entity('transactions')
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    symbol: string;

    @Column({ type: 'enum', enum: ['BUY', 'SELL'] })
    type: 'BUY' | 'SELL';

    @Column('float')
    quantity: number;

    @Column('float')
    price: number;

    @Column('float', { default: 0 })
    fee: number;

    @Column({ name: 'user_id' })
    userId: string;

    @ManyToOne(() => User, (user) => user.transactions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    // TODO: Uncomment and implement when Company entity is created
    // @ManyToOne(() => Company, (company) => company.transactions)
    // @JoinColumn({ name: 'symbol', referencedColumnName: 'symbol' })
    // company: Company;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
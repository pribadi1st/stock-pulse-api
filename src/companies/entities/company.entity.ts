import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Earning } from "../../earnings/entities/earning.entity";

@Entity({ name: "Companies" })
export class Company {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    symbol: string;

    @Column()
    name: string;

    @Column()
    displaySymbol: string;

    @Column()
    currency: string;

    @Column()
    figi: string;

    @Column()
    type: string;

    @Column()
    mic: string;

    @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP', name: 'createdAt' })
    createdAt: Date;

    @OneToMany(() => Earning, earning => earning.company)
    earnings: Earning[];

    @Column({ nullable: true, type: 'varchar', length: 255 })
    country: string | null;

    @Column({ nullable: true, type: 'varchar', length: 255 })
    exchange: string | null;

    @Column({ nullable: true, type: 'date' })
    ipo: Date | null;

    @Column({ type: 'float', nullable: true })
    marketCapitalization: number | null;

    @Column({ type: 'bigint', nullable: true })
    shareOutstanding: bigint | null;

    @Column({ nullable: true, type: 'varchar', length: 255 })
    phone: string | null;

    @Column({ nullable: true, type: 'varchar', length: 255 })
    webUrl: string | null;

    @Column({ nullable: true, type: 'varchar', length: 255 })
    logo: string | null;

    @UpdateDateColumn({
        default: () => 'CURRENT_TIMESTAMP(6)',
        name: 'updatedAt',
        onUpdate: 'CURRENT_TIMESTAMP(6)'
    })
    updatedAt: Date;
}
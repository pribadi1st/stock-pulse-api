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

    @UpdateDateColumn({
        default: () => 'CURRENT_TIMESTAMP(6)',
        name: 'updatedAt',
        onUpdate: 'CURRENT_TIMESTAMP(6)'
    })
    updatedAt: Date;
}
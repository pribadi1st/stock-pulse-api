import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from "typeorm";
import { Company } from "../../companies/entities/company.entity";
import { Type } from "class-transformer";

@Entity({
    name: 'EarningsCalendar'
})
export class Earning {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    symbol: string;

    @Column()
    @Type(() => Date)
    date: Date;

    @Column({ type: 'numeric', precision: 10, scale: 4, nullable: true })
    epsActual: number;

    @Column({ type: 'numeric', precision: 10, scale: 4, nullable: true })
    epsEstimate: number;

    @Column({ nullable: true })
    hour: string;

    @Column({ nullable: true })
    quarter: number;

    @Column({ type: 'bigint', nullable: true })
    revenueActual: number;

    @Column({ type: 'bigint', nullable: true })
    revenueEstimate: number;

    @Column()
    year: number;

    @ManyToOne(() => Company, company => company.earnings)
    @JoinColumn({ name: 'symbol', referencedColumnName: 'symbol' })
    company: Company;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

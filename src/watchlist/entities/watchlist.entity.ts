import { Company } from "../../companies/entities/company.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";

@Entity({ name: 'watchlists' })
export class Watchlist {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 10 })
    symbol: string;

    @Column({ type: 'uuid', name: 'user_id' })
    userId: string;

    @ManyToOne(() => Company, company => company.watchlists)
    @JoinColumn({ name: 'symbol', referencedColumnName: 'symbol' })
    company: Company;
}

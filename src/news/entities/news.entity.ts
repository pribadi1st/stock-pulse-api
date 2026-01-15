import { Company } from "src/companies/entities/company.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class News {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    symbol: string;


    @Column({ nullable: true })
    category: string

    @Column()
    datetime: Date

    @Column()
    headline: string

    @Column({ name: "finnhub_id", nullable: true })
    finnhubID: number

    @Column({ nullable: true })
    image: string

    @Column({ nullable: true })
    source: string

    @Column({ nullable: true })
    summary: string

    @Column({ nullable: true })
    url: string

    @ManyToOne(() => Company, (company) => company.news)
    @JoinColumn({ name: "symbol", referencedColumnName: "symbol" })
    company: Company
}

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Company } from '../../companies/entities/company.entity';

@Entity('portfolios')
@Unique(['userId', 'symbol']) // Ensures one entry per stock per user
export class Portfolio {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'user_id' })
    userId: string;

    @Column()
    symbol: string;

    @Column('float')
    quantity: number;

    @Column('float', { name: 'avg_price' })
    avgPrice: number;

    // Relations
    @ManyToOne(() => User, (user) => user.portfolios, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Company, (company) => company.portfolios, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'symbol', referencedColumnName: 'symbol' })
    company: Company;

    // @UpdateDateColumn({ name: 'updated_at' })
    // updatedAt: Date;
}
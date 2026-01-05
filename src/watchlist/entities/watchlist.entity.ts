import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: 'watchlists' })
export class Watchlist {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 10 })
    symbol: string;

    @Column({ type: 'uuid', name: 'user_id' })
    userId: string;
}

import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('locations')
export class Location {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    state: string;

    @Column()
    latitude: string;

    @Column()
    longitude: string;

    @Column({ default: '' })
    description: string;

    // Not persisted in DB, used for response only
    barcodeCount?: number;

    @CreateDateColumn()
    create: Date;

    @UpdateDateColumn()
    update: Date;
}

import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('barcodes')
export class Barcode {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    code: string;

    @Column()
    state: string;

    @Column({ default: '' })
    stratum: string;

    @Column({ default: '' })
    name: string;

    @Column({ default: '' })
    document: string;

    @Column({ default: '' })
    address: string;

    @Column()
    location: string;

    @Column({ default: '' })
    latitude: string;

    @Column({ default: '' })
    longitude: string;

    @Column()
    date: String;

    @Column({ default: '' })
    keywords: string;
}

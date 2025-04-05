import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { HeartRateReading } from '../heart-rate/heart-rate.entity';

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column()
  gender: string;

  @OneToMany(() => HeartRateReading, (reading) => reading.patient)
  heartRateReadings: HeartRateReading[];
}

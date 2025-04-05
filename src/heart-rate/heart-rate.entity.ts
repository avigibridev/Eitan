import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Patient } from '../patients/patient.entity';

@Entity('heart_rate_readings')
@Index('idx_heart_rate_patient_timestamp', ['patient', 'timestamp']) 
export class HeartRateReading {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Patient, (patient) => patient.heartRateReadings)
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column({ type: 'timestamp' })
  timestamp: Date;

  @Column({ type: 'int', name: 'heart_rate' })
  heartRate: number;

}

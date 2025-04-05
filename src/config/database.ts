import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Patient } from '../patients/patient.entity';
import { HeartRateReading } from '../heart-rate/heart-rate.entity';

config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST ?? 'localhost',
    port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
    username: process.env.DATABASE_USER ?? 'myuser',
    password: process.env.DATABASE_PASS ?? 'mypassword',
    database: process.env.DATABASE_NAME ?? 'mydatabase',
    entities: [Patient, HeartRateReading],
    synchronize: true,
});

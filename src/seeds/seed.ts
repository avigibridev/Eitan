import { AppDataSource } from '../config/database';
import { Patient } from '../patients/patient.entity';
import { HeartRateReading } from '../heart-rate/heart-rate.entity';
import * as fs from 'fs';
import * as path from 'path';

(async () => {
  await AppDataSource.initialize();
  console.log('Database connected for seeding');

  const patientRepo = AppDataSource.getRepository(Patient);
  const heartRateRepo = AppDataSource.getRepository(HeartRateReading);

  const seedData = JSON.parse(fs.readFileSync(path.join(__dirname, 'patients.json'), 'utf-8'));

  for (const patientData of seedData.patients) {
    const patient = patientRepo.create(patientData);
    await patientRepo.save(patient);
  }

  for (const heartRateData of seedData.heartRateReadings) {
    const patient = await patientRepo.findOne({ where: { id: heartRateData.patientId } });
    if (patient) {
      const heartRateReading = heartRateRepo.create({
        patient,
        timestamp: new Date(heartRateData.timestamp),
        heartRate: heartRateData.heartRate,
      });
      await heartRateRepo.save(heartRateReading);
    }
  }

  console.log('Seeding complete');

  await AppDataSource.destroy();
  console.log('Database connection closed');
  process.exit();
})();

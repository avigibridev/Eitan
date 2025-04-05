import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { HeartRateReading } from './heart-rate.entity';
import { RedisService } from '../config/redis.service';

/**
 * HeartRateService handles the business logic related to heart rate readings.
 * It includes methods for fetching heart rate events, analytics, and managing patient request counts.
 */
@Injectable()
export class HeartRateService {
    constructor(
        @InjectRepository(HeartRateReading)
        private readonly heartRateRepo: Repository<HeartRateReading>,
        private readonly redisService: RedisService
    ) { }

    /**
     * Fetches high heart rate events (greater than 100) for a specific patient.
     * @param patientId The ID of the patient to fetch high heart rate events for.
     * @returns A list of high heart rate events for the patient.
     */
    async getHighHeartRateEvents(patientId: number) {
        return await this.heartRateRepo.find({
            where: { patient: { id: patientId }, heartRate: MoreThan(100) },
            order: { timestamp: 'DESC' },
        });
    }

    /**
     * Fetches heart rate analytics (average, max, min) for a specific patient within a time range.
     * @param patientId The ID of the patient for whom to fetch heart rate analytics.
     * @param start The start date for the time range.
     * @param end The end date for the time range.
     * @returns The heart rate analytics for the patient within the specified time range.
     */
    async getHeartRateAnalytics(patientId: number, start: Date, end: Date) {
        const readings = await this.heartRateRepo
            .createQueryBuilder('reading')
            .select('AVG(reading.heart_rate)', 'average')
            .addSelect('MAX(reading.heart_rate)', 'max')
            .addSelect('MIN(reading.heart_rate)', 'min')
            .where('reading.patient_id = :patientId', { patientId })
            .andWhere('reading.timestamp BETWEEN :start AND :end', { start, end })
            .getRawOne();

        return readings;
    }

    /**
     * Fetches heart rate analytics (average, max, min) for all patients within a given time range.
     * This method fetches the data in batches to optimize performance.
     * @param start The start date for the time range.
     * @param end The end date for the time range.
     * @returns A list of heart rate analytics for all patients within the specified time range.
     */
    async getAllHeartRateAnalytics(start: Date, end: Date) {
        let lastPatientId: number | null = null;
        const allResults: any[] = [];
        const batchSize = 100;
    
        while (true) {
            const results = await this.fetchBatch(start, end, lastPatientId, batchSize);
            if (results.length === 0) break;
    
            allResults.push(...results);
            lastPatientId = results[results.length - 1].patientId;
        }
    
        return allResults;
    }

    /**
     * Tracks the number of requests made by a specific patient using Redis.
     * @param patientId The ID of the patient whose request count is to be tracked.
     */
    async trackPatientRequest(patientId: number) {
        const redisClient = this.redisService.getClient();
        await redisClient.incr(`patient:${patientId}:requests`);
    }

    /**
     * Fetches the total number of requests made by a specific patient from Redis.
     * @param patientId The ID of the patient to fetch the request count for.
     * @returns The total number of requests made by the patient.
     */
    async getPatientRequestCount(patientId: number): Promise<number> {
        const redisClient = this.redisService.getClient();
        return Number(await redisClient.get(`patient:${patientId}:requests`)) || 0;
    }

    /**
     * Helper function to fetch heart rate analytics in batches for all patients.
     * @param start The start date for the time range.
     * @param end The end date for the time range.
     * @param lastPatientId The ID of the last patient processed in the previous batch (used for pagination).
     * @param batchSize The number of patients to process in each batch.
     * @returns A batch of heart rate analytics for all patients within the specified time range.
     */
    private async fetchBatch(start: Date, end: Date, lastPatientId: number | null, batchSize: number) {
        return this.heartRateRepo
            .createQueryBuilder('reading')
            .select('reading.patient_id', 'patientId')
            .addSelect('AVG(reading.heart_rate)', 'average')
            .addSelect('MAX(reading.heart_rate)', 'max')
            .addSelect('MIN(reading.heart_rate)', 'min')
            .where('reading.timestamp BETWEEN :start AND :end', { start, end })
            .andWhere(lastPatientId ? 'reading.patient_id > :lastPatientId' : '1=1', { lastPatientId })
            .groupBy('reading.patient_id')
            .orderBy('reading.patient_id', 'ASC')
            .limit(batchSize)
            .getRawMany();
    }
}

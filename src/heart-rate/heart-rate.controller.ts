import { Controller, Get, Param, Query } from '@nestjs/common';
import { HeartRateService } from './heart-rate.service';

/**
 * HeartRateController is responsible for handling heart rate-related requests.
 * It provides endpoints to fetch heart rate events, analytics, and request counts.
 */
@Controller('heart-rate')
export class HeartRateController {
  constructor(private readonly heartRateService: HeartRateService) {}

  /**
   * Fetches high heart rate events for a specific patient.
   * @param patientId The ID of the patient for whom to fetch high heart rate events.
   * @returns The list of high heart rate events for the patient.
   */
  @Get(':patientId/high-heart-rate-events')
  async getHighHeartRateEvents(@Param('patientId') patientId: number) {
    return this.heartRateService.getHighHeartRateEvents(patientId);
  }

  /**
   * Fetches heart rate analytics (average, max, min) for a specific patient within a given time range.
   * @param patientId The ID of the patient for whom to fetch heart rate analytics.
   * @param start The start date of the time range.
   * @param end The end date of the time range.
   * @returns The heart rate analytics for the patient within the specified time range.
   */
  @Get(':patientId/analytics')
  async getHeartRateAnalytics(
    @Param('patientId') patientId: number,
    @Query('start') start: string,
    @Query('end') end: string
  ) {
    return this.heartRateService.getHeartRateAnalytics(patientId, new Date(start), new Date(end));
  }

  /**
   * Fetches heart rate analytics (average, max, min) for all patients within a given time range.
   * @param start The start date of the time range.
   * @param end The end date of the time range.
   * @returns The heart rate analytics for all patients within the specified time range.
   */
  @Get('/analytics')
  async getAllHeartRateAnalytics(
    @Query('start') start: string,
    @Query('end') end: string
  ) {
    return this.heartRateService.getAllHeartRateAnalytics(new Date(start), new Date(end));
  }

  /**
   * Fetches the number of requests made for heart rate data by a specific patient.
   * @param patientId The ID of the patient for whom to fetch the request count.
   * @returns The request count for the patient.
   */
  @Get(':patientId/request-count')
  async getPatientRequestCount(@Param('patientId') patientId: number) {
    return this.heartRateService.getPatientRequestCount(patientId);
  }
}
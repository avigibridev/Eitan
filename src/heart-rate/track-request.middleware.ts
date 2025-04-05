import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { HeartRateService } from './heart-rate.service';

@Injectable()
export class TrackRequestMiddleware implements NestMiddleware {
  constructor(private readonly heartRateService: HeartRateService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const patientId = parseInt(req.params.patientId, 10);

    if (!isNaN(patientId)) {
      await this.heartRateService.trackPatientRequest(patientId);
    }

    next();
  }
}

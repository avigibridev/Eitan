import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeartRateService } from './heart-rate.service';
import { HeartRateController } from './heart-rate.controller';
import { HeartRateReading } from './heart-rate.entity';
import { PatientsModule } from '../patients/patients.module';
import { RedisService } from '../config/redis.service';
import { TrackRequestMiddleware } from './track-request.middleware'; // Import the middleware

@Module({
  imports: [TypeOrmModule.forFeature([HeartRateReading]), PatientsModule],
  providers: [HeartRateService, RedisService],
  controllers: [HeartRateController],
  exports: [HeartRateService],
})
export class HeartRateModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TrackRequestMiddleware)
      .forRoutes(
        'heart-rate/:patientId/high-heart-rate-events',
        'heart-rate/:patientId/analytics',
      );
  }
}

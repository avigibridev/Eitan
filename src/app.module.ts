import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PatientsModule } from './patients/patients.module';
import { HeartRateModule } from './heart-rate/heart-rate.module';
import { RedisService } from './config/redis.service';
import { AppDataSource } from './config/database';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(AppDataSource.options),
    PatientsModule,
    HeartRateModule,
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class AppModule {}

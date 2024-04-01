import { Module } from '@nestjs/common';
import { LoggingService } from './logger.service';

@Module({
  exports: [LoggingService],
  providers: [LoggingService],
})
export class LoggerModule {}

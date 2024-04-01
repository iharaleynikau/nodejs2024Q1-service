import { LoggingService } from './logger.service';

export const getExceptionHandler = (logger: LoggingService) => {
  process.on('uncaughtException', (error) => {
    logger.error('Unhandled exception', error.stack, 'UncughtException');
    process.exit(1);
  });

  process.on('unhandledRejection', (rejection) => {
    logger.error(
      'Unhandled rejection',
      rejection.toString(),
      'UnhanledRejection',
    );
  });
};

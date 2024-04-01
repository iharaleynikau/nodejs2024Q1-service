import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggingService } from './logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggingService) {}

  use(req: Request, res: Response, next: NextFunction) {
    res.on('close', () => {
      this.logger.log(
        `${req.method} CODE: ${res.statusCode} ${
          req.baseUrl
        } BODY: ${JSON.stringify(req.body)}, QUERY: ${JSON.stringify(
          req.query,
        )}`,
      );
    });
    next();
  }
}

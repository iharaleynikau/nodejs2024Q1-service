import { Injectable, ConsoleLogger } from '@nestjs/common';
import 'dotenv';
import * as process from 'node:process';
import * as fs from 'node:fs';
import * as path from 'path';

@Injectable()
export class LoggingService extends ConsoleLogger {
  private logsFileName = 'logs.log';
  private errorsLogFileName = 'errors.log';
  private logsFolder = path.join(process.cwd(), 'logs');

  private logLevel = parseInt(process.env.LOG_LEVEL, 10);
  private logFileMaxSize = parseInt(process.env.LOG_SIZE, 10);

  private timestamp = new Date().toJSON().slice(0, 10).replace(/-/g, '-');

  constructor() {
    super();
    this.createLogFiles();
  }

  private rotateLogsFile(fileName: string) {
    const newFileName = `${this.timestamp}-${fileName}`;
    const filePath = path.join(this.logsFolder, newFileName);

    fs.appendFileSync(filePath, '', { flag: 'w' });

    if (fileName.includes('error')) {
      this.errorsLogFileName = newFileName;
    } else {
      this.logsFileName = newFileName;
    }
  }

  private createLogFiles() {
    fs.mkdirSync(this.logsFolder, { recursive: true });
    this.rotateLogsFile(this.logsFileName);
    this.rotateLogsFile(this.errorsLogFileName);
  }

  private appendLogMessage(filePath: string, message: string) {
    const fileStats = fs.statSync(filePath);
    const isFileExceeded = fileStats?.size > this.logFileMaxSize;

    if (isFileExceeded) {
      this.rotateLogsFile(
        filePath.includes('error') ? 'errors.log' : 'logs.log',
      );
    }

    fs.appendFileSync(filePath, message, { encoding: 'utf-8' });
  }

  log(message: any) {
    if (this.logLevel >= 2) {
      const formattedMessage = `${this.timestamp} ${message}\n`;

      super.log(formattedMessage);

      this.appendLogMessage(
        path.join(this.logsFolder, this.logsFileName),
        formattedMessage,
      );
    }
  }

  logWarning(message: any) {
    if (this.logLevel >= 1) {
      const formattedMessage = `[${this.timestamp} warning: ${message}\n`;

      super.warn(formattedMessage);

      this.appendLogMessage(
        path.join(this.logsFolder, this.logsFileName),
        formattedMessage,
      );
    }
  }

  logError(message: any) {
    if (this.logLevel >= 0) {
      const formattedMessage = `${this.timestamp} error: ${
        typeof message === 'object' ? JSON.stringify(message, null, 2) : message
      }\n`;

      super.error(formattedMessage);

      this.appendLogMessage(
        path.join(this.logsFolder, this.errorsLogFileName),
        formattedMessage,
      );
    }
  }
}

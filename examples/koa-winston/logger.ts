import { createLogger, format, transports, Logger as WinstonLogger } from 'winston';
import tracer from 'cls-tracer';

const LEVEL = Symbol.for('level');
const MESSAGE = Symbol.for('message');

const customFormat = format.printf(({ timestamp, level, message, stack }) => {
  const requestId = tracer.id();
  message = requestId ? `RequestID=[${requestId}] ${message}` : message;
  return `${timestamp} - ${level.toUpperCase()} : ${message} ${stack || ''}`;
});

export const logger = createLogger({
  level: 'debug',
  transports: [
    new transports.Console({
      // Overriding winston log based on https://github.com/winstonjs/winston/issues/1305
      log(info, callback) {
        setImmediate(() => (this as WinstonLogger).emit('logged', info));
        if (this.stderrLevels && this.stderrLevels[info[LEVEL]]) {
          console.error(info[MESSAGE]); // eslint-disable-line no-console
          if (callback) {
            callback();
          }
          return;
        }
        console.log(info[MESSAGE]); // eslint-disable-line no-console
        if (callback) {
          callback();
        }
      },
      handleExceptions: true
    })
  ],
  format: format.combine(format.errors({ stack: true }), format.timestamp(), format.json(), customFormat),
  exitOnError: false
});

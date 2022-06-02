import { format, transports } from 'winston';
import { Format, TransformableInfo } from 'logform';
import TransportStream from 'winston-transport';

export const customLogFormat: any = format.printf(
  ({
    timestamp,
    level,
    context,
    message,
    ...meta
  }: TransformableInfo & {
    timestamp?: string;
    context?: string;
    meta?: Record<string, any>;
  }) => {
    if (Object.keys(meta).length) {
      message = `${message} ${JSON.stringify(meta)}`;
    }

    if (context) {
      message = `[${context}] ${message}`;
    }

    return `${timestamp || ''} ${level}: ${message}`;
  },
);

export function getFormat(): Format {
  // TODO fetch logging config from configuration
  const logFormat = process.env.LOG_FORMAT_USE_JSON || 'true';
  if (logFormat === 'true') {
    return format.combine(
      format.timestamp(),
      format.errors({ stack: true }),
      format.json(),
    );
  } else {
    return format.combine(
      format.timestamp(),
      format.colorize(),
      format.splat(),
      format.errors({ stack: true }),
      format.simple(),
      customLogFormat,
    );
  }
}

export const transportsLayers: TransportStream[] = [
  new transports.Console({
    handleExceptions: true,
    // disable logger in test
    silent: process.env.SILENT_LOGS === 'true',
  }),
];

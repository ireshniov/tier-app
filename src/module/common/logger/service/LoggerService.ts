import type { LoggerService as BaseLoggerService } from '@nestjs/common';
import type { Logger } from 'winston';
import { createLogger } from 'winston';
import { getFormat, transportsLayers } from '../utils';

export const DEFAULT_CONTEXT = 'AppModule';

export type LoggerMetaType = { label?: string; [optionName: string]: any };
export type ContextOrMetaType = string | LoggerMetaType;

export const logger: Logger = createLogger({
  level: process.env.LOG_LEVEL || 'debug',
  format: getFormat(),
  transports: transportsLayers,
});

export class LoggerService implements BaseLoggerService {
  private readonly logger: Logger;

  constructor(private readonly context: string = DEFAULT_CONTEXT) {
    this.logger = logger;
  }

  debug(message: string, contextOrMeta?: ContextOrMetaType): void {
    this.logger.debug(message, this.getMeta(contextOrMeta));
  }

  log(message: string, contextOrMeta?: ContextOrMetaType): void {
    this.debug(message, this.getMeta(contextOrMeta));
  }

  info(message: string, contextOrMeta?: ContextOrMetaType): void {
    this.logger.info(message, this.getMeta(contextOrMeta));
  }

  warn(message: string, contextOrMeta?: ContextOrMetaType): void {
    this.logger.warn(message, this.getMeta(contextOrMeta));
  }

  error(
    message: string,
    errorOrErrorStack?: Error | string,
    contextOrMeta?: ContextOrMetaType,
  ): void {
    this.logger.error(
      this.generateLoggerErrorMeta(message, errorOrErrorStack, contextOrMeta),
    );
  }

  exception(
    error: Error & { toObject?: <T = any>() => T },
    contextOrMeta?: ContextOrMetaType,
  ): void {
    this.logger.error(this.generateLoggerExceptionMeta(error, contextOrMeta));
  }

  generateLoggerErrorMeta(
    message: string,
    errorOrErrorStack?: Error | string,
    contextOrMeta?: ContextOrMetaType,
  ): Partial<LoggerMetaType> {
    const meta: Partial<LoggerMetaType> = {
      ...this.getMeta(contextOrMeta),
      message,
    };

    if (errorOrErrorStack) {
      if (errorOrErrorStack instanceof Error) {
        return this.generateLoggerExceptionMeta(errorOrErrorStack, meta);
      } else {
        meta.exception = { stack: errorOrErrorStack };
      }
    }

    return meta;
  }

  generateLoggerExceptionMeta(
    error: Error & { toObject?: <T = any>() => T },
    contextOrMeta?: ContextOrMetaType,
  ): Partial<LoggerMetaType> {
    let message: string =
      typeof contextOrMeta === 'object' && contextOrMeta?.message
        ? contextOrMeta.message
        : error.message;
    message = typeof message === 'object' ? JSON.stringify(message) : message;
    const meta: Partial<LoggerMetaType> = {
      ...this.getMeta(contextOrMeta),
      message,
    };

    meta.exception = { name: error.name, stack: error.stack };
    if (typeof error.toObject === 'function') {
      meta.exception = { ...meta.exception, ...error.toObject() };
    }

    return meta;
  }

  getMeta(contextOrMeta?: ContextOrMetaType): LoggerMetaType {
    let meta: Partial<LoggerMetaType> = {
      label:
        typeof contextOrMeta === 'string'
          ? contextOrMeta
          : contextOrMeta?.label
          ? contextOrMeta.label
          : this.context,
    };

    if (typeof contextOrMeta === 'object') {
      meta = { ...contextOrMeta, ...meta };
    }

    return meta;
  }
}

import { LoggerService } from '../service';

export function Logger(context?: string): any {
  return (target: Record<string, any>, key: string | symbol): void => {
    const loggerService: LoggerService = new LoggerService(
      context || target.constructor.name,
    );
    const updated: boolean = Reflect.defineProperty(target, key, {
      configurable: false,
      enumerable: true,
      value: loggerService,
      writable: false,
    });

    if (!updated) {
      throw new Error(
        `Unable to define ${String(key)} property for ${JSON.stringify(
          target,
        )}`,
      );
    }
  };
}

import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { Type } from '@nestjs/common/interfaces/type.interface';

export function getValidationPipeOf(expectedType: Type): ValidationPipe {
  return new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
    validationError: { target: false, value: false },
    exceptionFactory: (errors) => new BadRequestException(errors),
    expectedType,
    validateCustomDecorators: true,
  });
}

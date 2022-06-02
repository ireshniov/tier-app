import { INestApplication } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { appBootstrap } from '../../../src/app';
import {
  LoggerService,
  ShortenerModule,
  shortenerModuleMetadata,
  TestingApp,
} from '../../../src';

export function createIntegrationTestingModuleBuilder(): TestingModuleBuilder {
  return new TestingApp(
    ShortenerModule.name,
    shortenerModuleMetadata,
  ).getBuilder();
}

export async function createUnitTestingModule(
  appModuleMetadata: ModuleMetadata,
): Promise<TestingModule> {
  const testingBuilder: TestingApp = new TestingApp(
    ShortenerModule.name,
    appModuleMetadata,
  );

  return testingBuilder.getBuilder().compile();
}

export async function createTestingApp(
  testingModuleBuilder: TestingModuleBuilder,
): Promise<INestApplication> {
  const moduleFixture: TestingModule = await testingModuleBuilder.compile();

  const app: INestApplication = moduleFixture.createNestApplication();
  const logger: LoggerService = new LoggerService(ShortenerModule.name);

  await appBootstrap(app, logger);

  return app.init();
}

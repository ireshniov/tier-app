import { INestApplication } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import {
  KeyGeneratorModule,
  keyGeneratorModuleMetadata,
  LoggerService,
  TestingApp,
} from '../../../src';
import { appBootstrap } from '../../../src/app';

export function createIntegrationTestingModuleBuilder(): TestingModuleBuilder {
  return new TestingApp(
    KeyGeneratorModule.name,
    keyGeneratorModuleMetadata,
  ).getBuilder();
}

export async function createUnitTestingModule(
  appModuleMetadata: ModuleMetadata,
): Promise<TestingModule> {
  const testingBuilder: TestingApp = new TestingApp(
    KeyGeneratorModule.name,
    appModuleMetadata,
  );

  return testingBuilder.getBuilder().compile();
}

export async function createTestingApp(
  testingModuleBuilder: TestingModuleBuilder,
): Promise<INestApplication> {
  const moduleFixture: TestingModule = await testingModuleBuilder.compile();

  const app: INestApplication = moduleFixture.createNestApplication();
  const logger: LoggerService = new LoggerService(KeyGeneratorModule.name);

  await appBootstrap(app, logger);

  return app.init();
}

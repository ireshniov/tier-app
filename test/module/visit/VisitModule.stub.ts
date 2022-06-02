import { INestApplication } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import {
  LoggerService,
  TestingApp,
  VisitModule,
  visitModuleMetadata,
} from '../../../src';
import { TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { appBootstrap } from '../../../src/app';

export function createIntegrationTestingModuleBuilder(): TestingModuleBuilder {
  return new TestingApp(VisitModule.name, visitModuleMetadata).getBuilder();
}

export async function createUnitTestingModule(
  appModuleMetadata: ModuleMetadata,
): Promise<TestingModule> {
  const testingBuilder: TestingApp = new TestingApp(
    VisitModule.name,
    appModuleMetadata,
  );

  return testingBuilder.getBuilder().compile();
}

export async function createTestingApp(
  testingModuleBuilder: TestingModuleBuilder,
): Promise<INestApplication> {
  const moduleFixture: TestingModule = await testingModuleBuilder.compile();

  const app: INestApplication = moduleFixture.createNestApplication();
  const logger: LoggerService = new LoggerService(VisitModule.name);

  await appBootstrap(app, logger);

  return app.init();
}

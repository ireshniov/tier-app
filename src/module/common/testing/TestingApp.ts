import { INestApplication, INestApplicationContext } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';

export class TestingApp {
  readonly moduleBuilder: TestingModuleBuilder;

  constructor(
    private readonly appName: string,
    appModuleMetadata: ModuleMetadata,
  ) {
    this.moduleBuilder = Test.createTestingModule(appModuleMetadata);
  }

  getAppName(): string {
    return this.appName;
  }

  getBuilder(): TestingModuleBuilder {
    return this.moduleBuilder;
  }

  async getApp(): Promise<INestApplication> {
    const moduleFixture: TestingModule = await this.moduleBuilder.compile();
    const app: INestApplication = moduleFixture.createNestApplication();

    return app.init();
  }

  async getAppContext(): Promise<INestApplicationContext> {
    const moduleFixture: TestingModule = await this.moduleBuilder.compile();
    const app: INestApplicationContext = moduleFixture.createNestApplication();

    return app.init();
  }
}

import { Module, ModuleMetadata } from '@nestjs/common';
import { KeyGeneratorModule } from './key-generator';

export const cronKeyGeneratorRefreshCachedHashModuleMetadata: ModuleMetadata = {
  imports: [KeyGeneratorModule],
};

@Module(cronKeyGeneratorRefreshCachedHashModuleMetadata)
export class CronKeyGeneratorRefreshCachedHashModule {}

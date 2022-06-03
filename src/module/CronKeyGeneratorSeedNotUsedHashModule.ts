import { Module, ModuleMetadata } from '@nestjs/common';
import { KeyGeneratorModule } from './key-generator';

export const cronKeyGeneratorSeedNotUsedHashModuleMetadata: ModuleMetadata = {
  imports: [KeyGeneratorModule],
};

@Module(cronKeyGeneratorSeedNotUsedHashModuleMetadata)
export class CronKeyGeneratorSeedNotUsedHashModule {}

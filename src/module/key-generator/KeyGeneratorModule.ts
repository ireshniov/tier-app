import { Module, ModuleMetadata } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { postgres } from '../../config/postgres.ormconfig';
import { NotUsedHashRepository, UsedHashRepository } from './repository';
import { KeyGeneratorCacheService, KeyGeneratorService } from './service';
import { RedisModule } from '../common';

export const keyGeneratorModuleMetadata: ModuleMetadata = {
  imports: [
    RedisModule.register(process.env.REDIS_URL || 'redis://127.0.0.1:6379/1'),
    TypeOrmModule.forFeature([NotUsedHashRepository, UsedHashRepository]),
    TypeOrmModule.forRoot(postgres),
  ],
  providers: [KeyGeneratorCacheService, KeyGeneratorService],
  exports: [KeyGeneratorService],
};

@Module(keyGeneratorModuleMetadata)
export class KeyGeneratorModule {}

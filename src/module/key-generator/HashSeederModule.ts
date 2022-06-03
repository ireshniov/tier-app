import { Module, ModuleMetadata } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { postgres } from '../../config/postgres.ormconfig';
import { HashSeederService } from './service';

export const keyGeneratorHashSeederModuleMetadata: ModuleMetadata = {
  imports: [TypeOrmModule.forRoot(postgres)],
  providers: [HashSeederService],
  exports: [HashSeederService],
};

@Module(keyGeneratorHashSeederModuleMetadata)
export class HashSeederModule {}

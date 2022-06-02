import { Module, ModuleMetadata } from '@nestjs/common';
import { ShortenerModule } from './shortener';
import { VisitModule } from './visit';

export const appModuleMetadata: ModuleMetadata = {
  imports: [VisitModule, ShortenerModule],
};

@Module(appModuleMetadata)
export class AppModule {}

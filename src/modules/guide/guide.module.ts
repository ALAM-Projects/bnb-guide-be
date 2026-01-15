import { Module } from '@nestjs/common';
import { GuideService } from './guide.service';
import { GuideController } from './guide.controller';
import { GuideRepository } from './guide.repository';
import { DatabaseModule } from '@/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [GuideService, GuideRepository],
  controllers: [GuideController],
  exports: [GuideRepository],
})
export class GuideModule {}

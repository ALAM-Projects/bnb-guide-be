import { Module } from '@nestjs/common';
import { AuthModule } from './core/auth/auth.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './core/auth/guards/at.guard';
import { RtStrategy } from './core/auth/strategies/rt.strategy';
import { AtStrategy } from './core/auth/strategies/at.strategy';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    // Core / cross-cutting
    AuthModule,
    // Infrastructure
    DatabaseModule,
    // Feature modules (vertical slices)
    UserModule,
  ],
  providers: [
    RtStrategy,
    AtStrategy,
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DomainModule } from './domain/domain.module';
import { sqliteConfig } from './database/sqlite-config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync(sqliteConfig),
    DomainModule,
  ],
})
export class AppModule {}

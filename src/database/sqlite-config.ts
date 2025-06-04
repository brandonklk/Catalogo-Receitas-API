import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { join } from 'path';

export const sqliteConfig: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: configService.get<'sqlite'>('DB_TYPE'),
    database: configService.get<string>('DB_PATH'),
    synchronize: configService.get<boolean>('DB_SYNCHRONIZE'),
    entities: [join(__dirname, '../domain/**/entities/*.entity{.ts,.js}')],
  }),
};

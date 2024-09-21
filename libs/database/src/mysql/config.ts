import * as path from 'path'
import { ConfigService } from '@nestjs/config'
import { type TypeOrmModuleOptions } from '@nestjs/typeorm'

const configService = new ConfigService()

const entities = [path.join(process.cwd(), 'dist', 'src', 'modules/**/*.entity{.ts,.js}')]

export const MYSQL_CONFIGS: TypeOrmModuleOptions = {
  type: 'mysql',
  host: configService.get('MYSQL_HOST'),
  port: +configService.get('MYSQL_PORT'),
  username: configService.get('MYSQL_USER'),
  password: `${configService.get('MYSQL_PASSWORD')}`,
  database: configService.get('MYSQL_DATABASE'),
  entities,
  logging: configService.get('MYSQL_LOGGING') === 'true',
  synchronize: configService.get('MYSQL_SYNCHRONIZE') === 'true',
  dropSchema: configService.get('MYSQL_DROP_SCHEMA') === 'true'
}

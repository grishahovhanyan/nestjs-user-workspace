import 'tsconfig-paths/register'
import 'dotenv/config'
import * as path from 'path'
import { DataSource } from 'typeorm'

const entities = [path.join(process.cwd(), 'src', 'modules/**/entities/*.entity{.ts,.js}')]
const migrations = [path.join(__dirname, 'migrations', '*{.ts,.js}')]

export default new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: +process.env.MYSQL_PORT,
  username: process.env.MYSQL_USER,
  password: `${process.env.MYSQL_PASSWORD}`,
  database: process.env.MYSQL_DATABASE,
  entities,
  migrations,
  logging: process.env.MYSQL_LOGGING === 'true',
  synchronize: process.env.MYSQL_SYNCHRONIZE === 'true',
  dropSchema: process.env.MYSQL_DROP_SCHEMA === 'true'
})

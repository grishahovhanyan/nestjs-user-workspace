import { addTransactionalDataSource } from 'typeorm-transactional'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Logger, Module } from '@nestjs/common'
import { DataSource } from 'typeorm'

import { MySqlConfigService } from './mysql-config.service'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: MySqlConfigService,
      dataSourceFactory: async (options) => {
        const logger = new Logger('Database')

        if (!options) {
          throw new Error('[MySql database connection failed]: Invalid options passed')
        }

        try {
          const source = addTransactionalDataSource(new DataSource(options))
          await source.initialize()
          logger.log(`🎯 Database initialized successfully.`)

          return source
        } catch (error) {
          logger.error(error)

          throw error
        }
      }
    })
  ]
})
export class MySqlModule {}

import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'

import { BaseRepository } from '@app/database'
import { Channel } from './entities/channel.entity'

@Injectable()
export class ChannelsRepository extends BaseRepository<Channel> {
  constructor(dataSource: DataSource) {
    super(dataSource, Channel)
  }
}

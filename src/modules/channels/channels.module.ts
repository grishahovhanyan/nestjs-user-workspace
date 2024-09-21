import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Channel } from './entities/channel.entity'
import { ChannelsController } from './channels.controller'
import { ChannelsService } from './channels.service'
import { ChannelsRepository } from './channels.repository'
import { WorkspacesModule } from '@modules/workspaces/workspaces.module'

@Module({
  imports: [TypeOrmModule.forFeature([Channel]), WorkspacesModule],
  controllers: [ChannelsController],
  providers: [ChannelsService, ChannelsRepository],
  exports: [ChannelsService]
})
export class ChannelsModule {}

import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, UpdateResult } from 'typeorm'
import { DbRelations } from '@app/database'

import { CreateChannelDto, GetChannelsDto, UpdateChannelDto } from './dto/channel.dto'

import { ChannelsRepository } from './channels.repository'
import { Channel } from './entities/channel.entity'

@Injectable()
export class ChannelsService {
  constructor(
    private readonly channelsRepository: ChannelsRepository,
    @InjectRepository(Channel)
    private readonly repo: Repository<Channel> // Can be used to create queryBuilder
  ) { }

  async update(channelId: number, updateChannelInput: UpdateChannelDto): Promise<UpdateResult> {
    return await this.channelsRepository.update({ id: channelId }, updateChannelInput)
  }

  async create(createChannelInput: CreateChannelDto): Promise<Channel> {
    return await this.channelsRepository.create(createChannelInput)
  }

  async getAndCount(getChannelsInput: GetChannelsDto) {
    const { page, perPage, order, searchText, channelIdsToExclude, channelIdsToInclude } = getChannelsInput

    const queryBuilder = this.repo.createQueryBuilder('channel')

    queryBuilder.leftJoinAndSelect('channel.user', 'user')
    queryBuilder.leftJoinAndSelect('channel.workspace', 'workspace')

    if (searchText?.trim()) {
      queryBuilder.andWhere('channel.name LIKE :searchText', { searchText: `%${searchText.trim()}%` })
    }

    if (channelIdsToExclude?.length) {
      queryBuilder.andWhere('channel.id NOT IN (:...channelIdsToExclude)', { channelIdsToExclude })
    }

    if (channelIdsToInclude?.length) {
      queryBuilder.andWhere('channel.id IN (:...channelIdsToInclude)', { channelIdsToInclude })
    }

    queryBuilder.take(perPage).skip((page - 1) * perPage)

    if (order) {
      Object.entries(order).forEach(([key, value]) => {
        queryBuilder.addOrderBy(`channel.${key}`, value as 'ASC' | 'DESC')
      })
    }

    const [items, totalCount] = await queryBuilder.getManyAndCount()

    return { items, totalCount }
  }

  async getById(channelId: number): Promise<Channel | null> {
    return await this.channelsRepository.findOne({ id: channelId }, { relations: [DbRelations.workspace] })
  }

  async getByIdAndUserId(channelId: number, userId: number): Promise<Channel | null> {
    return await this.channelsRepository.findOne({ id: channelId, userId }, { relations: [DbRelations.workspace] })
  }

  async getByIdAndWorkspaceId(channelId: number, workspaceId: number): Promise<Channel | null> {
    return await this.channelsRepository.findOne({ id: channelId, workspaceId }, { relations: [DbRelations.workspace] })
  }

  async delete(channelId: number) {
    return await this.channelsRepository.delete({ id: channelId })
  }
}

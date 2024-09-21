import { Get, Query, Param, Post, Patch, Body, Delete } from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger'
// NOTE: This can be implemented in future to remove swagger details from controller (like in UsersModule)
// import { SwaggerChannels } from '@app/swagger'

import {
  PAGE_SIZE_TYPES,
  getPaginationAndSortOrder,
  paginatedResponse,
  NotFoundException,
  EnhancedController,
  RequestUser,
  TransformResponse,
  CHANNELS_SORT_FIELDS,
  SUCCESS_RESPONSE,
  getPaginationResponseDto
} from '@app/common'
import { CreateChannelDto, GetChannelsDto, UpdateChannelDto } from './dto/channel.dto'
import { ChannelResponseDto } from './dto/channel-response.dto'
import { ChannelsService } from './channels.service'
import { WorkspacesService } from '@modules/workspaces/workspaces.service'

@EnhancedController('workspaces/:workspaceId/channels', true, 'Channels')
@TransformResponse(ChannelResponseDto)
export class ChannelsController {
  constructor(
    private readonly channelsService: ChannelsService,
    private readonly workspacesService: WorkspacesService
  ) { }

  @Get()
  @ApiOkResponse({ type: getPaginationResponseDto(ChannelResponseDto) })
  async index(
    @RequestUser('id') currentUserId: number,
    @Param('workspaceId') workspaceId: number,
    @Query() query: GetChannelsDto
  ) {
    const workspace = await this.workspacesService.getByIdAndUserId(workspaceId, currentUserId)

    if (!workspace) {
      throw new NotFoundException()
    }

    const { page, perPage, order } = getPaginationAndSortOrder(query, PAGE_SIZE_TYPES.channels, CHANNELS_SORT_FIELDS)

    const getAndCountInput: GetChannelsDto = {
      ...query,
      page,
      perPage,
      order,
      userId: currentUserId
    }
    const { items, totalCount } = await this.channelsService.getAndCount(getAndCountInput)

    return paginatedResponse(items, totalCount, page, perPage)
  }

  @Get(':id')
  @ApiOkResponse({ type: ChannelResponseDto })
  async find(
    @RequestUser('id') currentUserId: number,
    @Param('workspaceId') workspaceId: number,
    @Param('id') channelId: number
  ) {
    const workspace = await this.workspacesService.getByIdAndUserId(workspaceId, currentUserId)
    const channel = await this.channelsService.getByIdAndWorkspaceId(channelId, workspaceId)

    if (!workspace || !channel) {
      throw new NotFoundException()
    }

    return channel
  }

  @Post()
  @ApiCreatedResponse({ type: ChannelResponseDto })
  async create(
    @RequestUser('id') currentUserId: number,
    @Param('workspaceId') workspaceId: number,
    @Body() createChannelDto: CreateChannelDto
  ) {
    const workspace = await this.workspacesService.getByIdAndUserId(workspaceId, currentUserId)

    if (!workspace) {
      throw new NotFoundException()
    }

    const channel = await this.channelsService.create({ ...createChannelDto, workspaceId, userId: currentUserId })

    return channel
  }

  @Patch(':id')
  @ApiOkResponse({ type: ChannelResponseDto })
  async update(
    @RequestUser('id') currentUserId: number,
    @Param('workspaceId') workspaceId: number,
    @Param('id') channelId: number,
    @Body() updateChannelDto: UpdateChannelDto
  ) {
    const workspace = await this.workspacesService.getByIdAndUserId(workspaceId, currentUserId)
    const channel = await this.channelsService.getByIdAndWorkspaceId(channelId, workspaceId)

    if (!workspace || !channel) {
      throw new NotFoundException()
    }

    await this.channelsService.update(channelId, updateChannelDto)

    const updatedChannel = await this.channelsService.getById(channelId)

    return updatedChannel
  }

  @Delete(':id')
  @ApiOkResponse({ type: ChannelResponseDto })
  async delete(
    @RequestUser('id') currentUserId: number,
    @Param('workspaceId') workspaceId: number,
    @Param('id') channelId: number
  ) {
    const workspace = await this.workspacesService.getByIdAndUserId(workspaceId, currentUserId)
    const channel = await this.channelsService.getByIdAndWorkspaceId(channelId, workspaceId)

    if (!workspace || !channel) {
      throw new NotFoundException()
    }

    await this.channelsService.delete(channelId)

    return SUCCESS_RESPONSE
  }
}

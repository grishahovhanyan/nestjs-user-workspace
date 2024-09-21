import { Get, Query, Param, Post, Body, Patch, Delete } from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger'
// NOTE: This can be implemented in future to remove swagger details from controller (like in UsersModule)
// import { SwaggerWorkspaces } from '@app/swagger'

import {
  PAGE_SIZE_TYPES,
  getPaginationAndSortOrder,
  paginatedResponse,
  BadRequestException,
  NotFoundException,
  EnhancedController,
  RequestUser,
  TransformResponse,
  WORKSPACES_SORT_FIELDS,
  ERROR_MESSAGES,
  SUCCESS_RESPONSE,
  WorkspaceInvitationStatusEnum,
  getPaginationResponseDto,
  ForbiddenException
} from '@app/common'
import { GetWorkspacesDto, CreateWorkspaceDto, UpdateWorkspaceDto } from './dto/workspace.dto'
import { GetWorkspaceInvitationsDto, CreateInvitationDto, UpdateInvitationDto } from './dto/workspace-invitation.dto'
import { WorkspaceResponseDto } from './dto/workspace-response.dto'
import { WorkspaceInvitationResponseDto } from './dto/workspace-invitation-response.dto'

import { WorkspacesService } from './workspaces.service'
import { UsersService } from '@modules/users/users.service'
import { WorkspaceInvitationsService } from './workspace-invitations.service'

@EnhancedController('workspaces')
export class WorkspacesController {
  constructor(
    private readonly workspacesService: WorkspacesService,
    private readonly usersService: UsersService,
    private readonly workspaceInvitationsService: WorkspaceInvitationsService
  ) { }

  @Get()
  @TransformResponse(WorkspaceResponseDto)
  @ApiOkResponse({ type: getPaginationResponseDto(WorkspaceResponseDto) })
  async index(@RequestUser('id') currentUserId: number, @Query() query: GetWorkspacesDto) {
    const { page, perPage, order } = getPaginationAndSortOrder(
      query,
      PAGE_SIZE_TYPES.workspaces,
      WORKSPACES_SORT_FIELDS
    )

    const getAndCountInput: GetWorkspacesDto = {
      ...query,
      page,
      perPage,
      order,
      userId: currentUserId
    }
    const { items, totalCount } = await this.workspacesService.getAndCount(getAndCountInput)

    return paginatedResponse(items, totalCount, page, perPage)
  }

  @Get('invitations')
  @TransformResponse(WorkspaceInvitationResponseDto)
  @ApiOkResponse({ type: getPaginationResponseDto(WorkspaceInvitationResponseDto) })
  async getInvitations(@RequestUser('id') currentUserId: number, @Query() query: GetWorkspaceInvitationsDto) {
    const { page, perPage, order } = getPaginationAndSortOrder(query, PAGE_SIZE_TYPES.workspacesInvitations)

    const getAndCountInput: GetWorkspaceInvitationsDto = {
      ...query,
      page,
      perPage,
      order,
      userId: currentUserId
    }
    const { items, totalCount } = await this.workspaceInvitationsService.getAndCount(getAndCountInput)

    return paginatedResponse(items, totalCount, page, perPage)
  }

  @Post(':id/invitations')
  @TransformResponse(WorkspaceResponseDto)
  @ApiCreatedResponse({ type: WorkspaceResponseDto })
  async createInvitation(
    @RequestUser('id') currentUserId: number,
    @Param('id') workspaceId: number,
    @Body() createInvitationDto: CreateInvitationDto
  ) {
    const workspace = await this.workspacesService.getByIdAndUserId(workspaceId, currentUserId)
    const user = await this.usersService.getById(createInvitationDto.userId)

    if (!workspace || !user) {
      throw new NotFoundException()
    }

    if (user.id === currentUserId) {
      throw new ForbiddenException()
    }

    const existingInvitation = await this.workspaceInvitationsService.getByUserIdAndWorkspaceId(
      createInvitationDto.userId,
      workspaceId
    )

    if (existingInvitation) {
      throw new BadRequestException(ERROR_MESSAGES.userAlreadyInvited)
    }

    await this.workspaceInvitationsService.create({
      userId: createInvitationDto.userId,
      inviterId: currentUserId,
      workspaceId
    })

    return workspace
  }

  @Patch('invitations/:id')
  @TransformResponse(WorkspaceResponseDto)
  @ApiOkResponse({ type: WorkspaceInvitationResponseDto })
  async updateInvitation(
    @RequestUser('id') currentUserId: number,
    @Param('id') invitationId: number,
    @Body() updateInvitationDto: UpdateInvitationDto
  ) {
    const invitation = await this.workspaceInvitationsService.getById(invitationId)

    if (!invitation || invitation.userId !== currentUserId) {
      throw new NotFoundException()
    }

    if (invitation.status === WorkspaceInvitationStatusEnum.DECLINED) {
      throw new BadRequestException(ERROR_MESSAGES.invitationDeclined)
    }

    if (invitation.status === WorkspaceInvitationStatusEnum.ACCEPTED) {
      throw new BadRequestException(ERROR_MESSAGES.invitationAccepted)
    }

    await this.workspaceInvitationsService.update(invitationId, updateInvitationDto)

    return invitation.workspace
  }

  @Get(':id')
  @TransformResponse(WorkspaceResponseDto)
  @ApiOkResponse({ type: WorkspaceResponseDto })
  async find(@RequestUser('id') currentUserId: number, @Param('id') workspaceId: number) {
    const workspace = await this.workspacesService.getByIdAndUserId(workspaceId, currentUserId)

    if (!workspace) {
      throw new NotFoundException()
    }

    return workspace
  }

  @Post()
  @TransformResponse(WorkspaceResponseDto)
  @ApiCreatedResponse({ type: WorkspaceResponseDto })
  async create(@RequestUser('id') currentUserId: number, @Body() createWorkspaceDto: CreateWorkspaceDto) {
    const existingWorkspace = await this.workspacesService.getBySlug(createWorkspaceDto.slug)

    if (existingWorkspace) {
      throw new BadRequestException(ERROR_MESSAGES.workspaceAlreadyExists)
    }

    const workspace = await this.workspacesService.create({ ...createWorkspaceDto, userId: currentUserId })

    return workspace
  }

  @Patch(':id')
  @TransformResponse(WorkspaceResponseDto)
  @ApiOkResponse({ type: WorkspaceResponseDto })
  async update(
    @RequestUser('id') currentUserId: number,
    @Param('id') workspaceId: number,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto
  ) {
    const workspace = await this.workspacesService.getByIdAndUserId(workspaceId, currentUserId)

    if (!workspace) {
      throw new NotFoundException()
    }

    await this.workspacesService.update(workspaceId, updateWorkspaceDto)

    const updatedWorkspace = await this.workspacesService.getById(workspaceId)

    return updatedWorkspace
  }

  @Delete(':id')
  async delete(@RequestUser('id') currentUserId: number, @Param('id') workspaceId: number) {
    const workspace = await this.workspacesService.getByIdAndUserId(workspaceId, currentUserId)

    if (!workspace) {
      throw new NotFoundException()
    }

    await this.workspacesService.delete(workspaceId)

    return SUCCESS_RESPONSE
  }
}

import { Injectable } from '@nestjs/common'
import { FindOptionsWhere, UpdateResult } from 'typeorm'

import { WorkspaceInvitationStatusEnum } from '@app/common'
import { DbRelations } from '@app/database'
import { GetWorkspaceInvitationsDto, CreateInvitationDto, UpdateInvitationDto } from './dto/workspace-invitation.dto'
import { WorkspaceInvitationsRepository } from './workspace-invitations.repository'
import { WorkspaceInvitation } from './entities/workspace-invitation.entity'

@Injectable()
export class WorkspaceInvitationsService {
  constructor(private readonly workspaceInvitationsRepository: WorkspaceInvitationsRepository) {}

  async create(createInvitationInput: CreateInvitationDto): Promise<WorkspaceInvitation> {
    return await this.workspaceInvitationsRepository.create(createInvitationInput)
  }

  async update(invitationId: number, updateInvitationDto: UpdateInvitationDto): Promise<UpdateResult> {
    return await this.workspaceInvitationsRepository.update({ id: invitationId }, updateInvitationDto)
  }

  async getAndCount(getInvitationsDto: GetWorkspaceInvitationsDto) {
    const { page, perPage, order, workspaceId, userId, inviterId, status } = getInvitationsDto

    const conditions: FindOptionsWhere<WorkspaceInvitation> = {
      ...(workspaceId ? { workspaceId } : {}),
      ...(userId ? { userId } : {}),
      ...(inviterId ? { inviterId } : {})
    }

    if (status) {
      conditions.status = status
    } else {
      conditions.status = WorkspaceInvitationStatusEnum.PENDING
    }

    return await this.workspaceInvitationsRepository.findAndCount({
      conditions,
      relations: [DbRelations.user, DbRelations.inviter, DbRelations.workspace],
      take: perPage,
      skip: (page - 1) * perPage,
      order
    })
  }

  async getById(invitationId: number): Promise<WorkspaceInvitation | null> {
    return await this.workspaceInvitationsRepository.findOne(
      { id: invitationId },
      { relations: [DbRelations.workspace] }
    )
  }

  async getByUserIdAndWorkspaceId(userId: number, workspaceId: number): Promise<WorkspaceInvitation | null> {
    return await this.workspaceInvitationsRepository.findOne(
      { userId, workspaceId },
      { relations: [DbRelations.workspace] }
    )
  }
}

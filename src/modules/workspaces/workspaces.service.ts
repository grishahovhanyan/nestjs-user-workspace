import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Brackets, Repository, UpdateResult } from 'typeorm'
import { DbRelations } from '@app/database'
import { WorkspaceInvitationStatusEnum } from '@app/common'

import { CreateWorkspaceDto, GetWorkspacesDto, UpdateWorkspaceDto } from './dto/workspace.dto'

import { WorkspacesRepository } from './workspaces.repository'
import { Workspace } from './entities/workspace.entity'

@Injectable()
export class WorkspacesService {
  constructor(
    private readonly workspacesRepository: WorkspacesRepository,
    @InjectRepository(Workspace)
    private readonly repo: Repository<Workspace> // Can be used to create queryBuilder
  ) { }

  async create(createWorkspaceInput: CreateWorkspaceDto): Promise<Workspace> {
    return await this.workspacesRepository.create(createWorkspaceInput)
  }

  async update(workspaceId: number, updateWorkspaceInput: UpdateWorkspaceDto): Promise<UpdateResult> {
    return await this.workspacesRepository.update({ id: workspaceId }, updateWorkspaceInput)
  }

  async getAndCount(getWorkspacesInput: GetWorkspacesDto) {
    const { page, perPage, order, searchText, userId, workspaceIdsToExclude, workspaceIdsToInclude } =
      getWorkspacesInput

    const queryBuilder = this.repo.createQueryBuilder('workspace')

    queryBuilder.leftJoinAndSelect('workspace.user', 'user')
    queryBuilder.leftJoinAndSelect(
      'workspace.invitations',
      'invitations',
      'invitations.status = :acceptedStatus AND invitations.userId = :userId',
      {
        acceptedStatus: WorkspaceInvitationStatusEnum.ACCEPTED,
        userId
      }
    )

    // Filter workspaces where workspace.userId = userId OR there's an approved invitation for userId
    queryBuilder.where(
      new Brackets((qb) => {
        qb.where('workspace.userId = :userId', { userId }).orWhere('invitations.id IS NOT NULL')
      })
    )

    if (searchText?.trim()) {
      queryBuilder.andWhere('workspace.name LIKE :searchText', { searchText: `%${searchText.trim()}%` })
    }

    if (workspaceIdsToExclude?.length) {
      queryBuilder.andWhere('workspace.id NOT IN (:...workspaceIdsToExclude)', { workspaceIdsToExclude })
    }

    if (workspaceIdsToInclude?.length) {
      queryBuilder.andWhere('workspace.id IN (:...workspaceIdsToInclude)', { workspaceIdsToInclude })
    }

    queryBuilder.take(perPage).skip((page - 1) * perPage)

    if (order) {
      Object.entries(order).forEach(([key, value]) => {
        queryBuilder.addOrderBy(`workspace.${key}`, value as 'ASC' | 'DESC')
      })
    }

    const [items, totalCount] = await queryBuilder.getManyAndCount()

    return { items, totalCount }
  }

  async getById(workspaceId: number): Promise<Workspace | null> {
    return await this.workspacesRepository.findOne({ id: workspaceId }, { relations: [DbRelations.channels] })
  }

  async getByIdAndUserId(workspaceId: number, userId: number): Promise<Workspace | null> {
    const queryBuilder = this.repo.createQueryBuilder('workspace')

    queryBuilder.leftJoinAndSelect('workspace.user', 'user')
    queryBuilder.leftJoinAndSelect(
      'workspace.invitations',
      'invitations',
      'invitations.status = :acceptedStatus AND invitations.userId = :userId',
      {
        acceptedStatus: WorkspaceInvitationStatusEnum.ACCEPTED,
        userId
      }
    )

    // Filter workspaces where workspace.userId = userId OR there's an approved invitation for userId
    queryBuilder.where(
      new Brackets((qb) => {
        qb.where('workspace.userId = :userId', { userId }).orWhere('invitations.id IS NOT NULL')
      })
    )

    queryBuilder.andWhere('workspace.id = :workspaceId', { workspaceId })

    return await queryBuilder.getOne()
  }

  async getBySlug(slug: string): Promise<Workspace | null> {
    return await this.workspacesRepository.findOne({ slug }, { relations: [DbRelations.channels] })
  }

  async delete(workspaceId: number) {
    return await this.workspacesRepository.delete({ id: workspaceId })
  }
}

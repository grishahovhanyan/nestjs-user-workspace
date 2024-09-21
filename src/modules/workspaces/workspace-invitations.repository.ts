import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'

import { BaseRepository } from '@app/database'
import { WorkspaceInvitation } from './entities/workspace-invitation.entity'

@Injectable()
export class WorkspaceInvitationsRepository extends BaseRepository<WorkspaceInvitation> {
  constructor(dataSource: DataSource) {
    super(dataSource, WorkspaceInvitation)
  }
}

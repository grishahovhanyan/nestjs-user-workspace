import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'

import { BaseRepository } from '@app/database'
import { Workspace } from './entities/workspace.entity'

@Injectable()
export class WorkspacesRepository extends BaseRepository<Workspace> {
  constructor(dataSource: DataSource) {
    super(dataSource, Workspace)
  }
}

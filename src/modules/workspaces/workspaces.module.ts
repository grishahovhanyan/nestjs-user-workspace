import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Workspace } from './entities/workspace.entity'
import { WorkspaceInvitation } from './entities/workspace-invitation.entity'

import { WorkspacesController } from './workspaces.controller'
import { WorkspacesService } from './workspaces.service'
import { WorkspacesRepository } from './workspaces.repository'
import { WorkspaceInvitationsService } from './workspace-invitations.service'
import { WorkspaceInvitationsRepository } from './workspace-invitations.repository'
import { UsersModule } from '@modules/users/users.module'
import { Channel } from '@modules/channels/entities/channel.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Workspace, WorkspaceInvitation, Channel]), UsersModule],
  controllers: [WorkspacesController],
  providers: [WorkspacesService, WorkspacesRepository, WorkspaceInvitationsService, WorkspaceInvitationsRepository],
  exports: [WorkspacesService, WorkspaceInvitationsService]
})
export class WorkspacesModule {}

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { DbTables } from '@app/database'

import { User } from '@modules/users/entities/user.entity'
import { Workspace } from './workspace.entity'
import { WorkspaceInvitationStatusEnum } from '@app/common/enums/workspace.enum'

@Entity(DbTables.workspace_invitations)
export class WorkspaceInvitation {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  userId: number

  @Column()
  inviterId: number

  @Column()
  workspaceId: number

  @Column({ type: 'varchar', length: 40, default: WorkspaceInvitationStatusEnum.PENDING })
  status: string

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  createdAt: Date

  @ManyToOne(() => Workspace, (workspace) => workspace.invitations, { onDelete: 'CASCADE' })
  workspace: Workspace

  @JoinColumn({ name: 'userId' })
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User

  @JoinColumn({ name: 'inviterId' })
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  inviter: User
}

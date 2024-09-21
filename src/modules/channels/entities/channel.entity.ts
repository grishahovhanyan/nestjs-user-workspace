import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, JoinColumn, ManyToOne } from 'typeorm'
import { DbTables } from '@app/database'

import { User } from '@modules/users/entities/user.entity'
import { Workspace } from '@modules/workspaces/entities/workspace.entity'

@Entity(DbTables.channels)
export class Channel {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false })
  name: string

  @Column({ nullable: false })
  userId: number

  @Column({ nullable: false })
  workspaceId: number

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  createdAt: Date

  @JoinColumn({ name: 'userId' })
  @ManyToOne(() => User, { eager: true, cascade: true, onDelete: 'CASCADE' })
  user: User

  @JoinColumn({ name: 'workspaceId' })
  @ManyToOne(() => Workspace, { eager: true, cascade: true, onDelete: 'CASCADE' })
  workspace: Workspace
}

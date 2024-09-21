import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { DbTables } from '@app/database'

import { User } from '@modules/users/entities/user.entity'
import { Channel } from '@modules/channels/entities/channel.entity'
import { WorkspaceInvitation } from './workspace-invitation.entity'

@Entity(DbTables.workspaces)
export class Workspace {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false })
  name: string

  @Column({ nullable: false })
  userId: number

  @Column({ nullable: false, unique: true })
  slug: string

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  createdAt: Date

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.workspaces, { eager: true, cascade: true, onDelete: 'CASCADE' })
  user: User

  @OneToMany(() => Channel, (channel) => channel.workspace)
  channels: Channel[]

  @OneToMany(() => WorkspaceInvitation, (invitation) => invitation.workspace)
  invitations: WorkspaceInvitation
}

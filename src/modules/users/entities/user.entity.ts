import { Exclude, Expose } from 'class-transformer'
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm'
import { DbTables } from '@app/database'

import { PasswordTransformer, calculateAge } from '@app/common'
import { Workspace } from '@modules/workspaces/entities/workspace.entity'

@Entity(DbTables.users)
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false })
  firstName: string

  @Column({ nullable: false })
  lastName: string

  @Column({ nullable: false })
  email: string

  @Column({ nullable: false })
  birthDate: string

  @Column({ nullable: true })
  image: string

  @Exclude()
  @Column({
    transformer: new PasswordTransformer(),
    nullable: false
  })
  password: string

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  registeredAt: Date

  @OneToMany(() => Workspace, (workspace) => workspace.user)
  workspaces: Workspace[]

  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`
  }

  @Expose()
  get age(): number {
    return calculateAge(this.birthDate)
  }
}

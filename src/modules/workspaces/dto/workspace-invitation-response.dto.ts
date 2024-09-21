import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose, Type } from 'class-transformer'

import { WorkspaceInvitationStatusEnum } from '@app/common'
import { UserResponseDto } from '@modules/users/dto/user-response.dto'
import { WorkspaceResponseDto } from './workspace-response.dto'

@Exclude()
export class WorkspaceInvitationResponseDto {
  @Expose()
  @ApiProperty()
  id: number

  @Expose()
  @ApiProperty()
  userId: number

  @Expose()
  @ApiProperty()
  inviterId: number

  @Expose()
  @ApiProperty()
  workspaceId: number

  @Expose()
  @ApiProperty({ enum: WorkspaceInvitationStatusEnum })
  status: WorkspaceInvitationStatusEnum

  @Expose()
  @ApiProperty({ type: UserResponseDto })
  @Type(() => UserResponseDto)
  user: UserResponseDto

  @Expose()
  @ApiProperty({ type: UserResponseDto })
  @Type(() => UserResponseDto)
  inviter: UserResponseDto

  @Expose()
  @ApiProperty({ type: WorkspaceResponseDto })
  @Type(() => WorkspaceResponseDto)
  workspace: WorkspaceResponseDto
}

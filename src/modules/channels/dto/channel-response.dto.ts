import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose, Type } from 'class-transformer'

import { UserResponseDto } from '@modules/users/dto/user-response.dto'
import { WorkspaceResponseDto } from '@modules/workspaces/dto/workspace-response.dto'

@Exclude()
export class ChannelResponseDto {
  @Expose()
  @ApiProperty()
  id: number

  @Expose()
  @ApiProperty()
  name: string

  @Expose()
  @ApiProperty()
  userId: number

  @Expose()
  @ApiProperty()
  workspaceId: number

  @Expose()
  @ApiProperty()
  createdAt: string

  @Expose()
  @ApiProperty({ type: UserResponseDto })
  @Type(() => UserResponseDto)
  user: UserResponseDto

  @Expose()
  @ApiProperty({ type: WorkspaceResponseDto })
  @Type(() => WorkspaceResponseDto)
  workspace: WorkspaceResponseDto
}

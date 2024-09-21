import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose, Type } from 'class-transformer'

import { UserResponseDto } from '@modules/users/dto/user-response.dto'

@Exclude()
export class WorkspaceResponseDto {
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
  slug: string

  @Expose()
  @ApiProperty()
  createdAt: string

  @Expose()
  @ApiProperty({ type: UserResponseDto })
  @Type(() => UserResponseDto)
  user: UserResponseDto
}

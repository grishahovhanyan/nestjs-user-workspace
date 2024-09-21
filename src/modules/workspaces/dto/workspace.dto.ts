import { IsDefined, IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { WORKSPACES_SORT_FIELDS, getOrderingDescription } from '@app/common'
import { IOrderObject } from '@app/database'

export class GetWorkspacesDto {
  @ApiPropertyOptional()
  page?: number

  @ApiPropertyOptional()
  perPage?: number

  @ApiPropertyOptional({ description: getOrderingDescription(WORKSPACES_SORT_FIELDS) })
  ordering?: string

  @ApiPropertyOptional({ description: 'Text for searching' })
  searchText?: string

  order?: IOrderObject
  userId: number
  workspaceIdsToExclude?: number[]
  workspaceIdsToInclude?: number[]
}

export class CreateWorkspaceDto {
  @ApiProperty()
  @IsString()
  @IsDefined()
  name: string

  @ApiProperty()
  @IsString()
  @IsDefined()
  slug: string

  userId: number
}

export class UpdateWorkspaceDto {
  @ApiPropertyOptional()
  @IsString()
  name?: string
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { CHANNELS_SORT_FIELDS, getOrderingDescription } from '@app/common'
import { IOrderObject } from '@app/database'
import { IsDefined, IsString } from 'class-validator'

export class GetChannelsDto {
  @ApiPropertyOptional()
  page?: number

  @ApiPropertyOptional()
  perPage?: number

  @ApiPropertyOptional({ description: getOrderingDescription(CHANNELS_SORT_FIELDS) })
  ordering?: string

  @ApiPropertyOptional({ description: 'Text for searching' })
  searchText?: string

  order?: IOrderObject
  userId?: number
  channelIdsToExclude?: number[]
  channelIdsToInclude?: number[]
}

export class CreateChannelDto {
  @ApiProperty()
  @IsString()
  @IsDefined()
  name: string

  userId: number
  workspaceId: number
}

export class UpdateChannelDto {
  @ApiPropertyOptional()
  @IsString()
  name?: string
}

import { IsDefined, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { WORKSPACES_SORT_FIELDS, WorkspaceInvitationStatusEnum, getOrderingDescription } from '@app/common'
import { IOrderObject } from '@app/database'

export class GetWorkspaceInvitationsDto {
  @ApiPropertyOptional()
  page?: number

  @ApiPropertyOptional()
  perPage?: number

  @ApiPropertyOptional({ description: getOrderingDescription(WORKSPACES_SORT_FIELDS) })
  ordering?: string

  @ApiPropertyOptional()
  workspaceId?: number

  @ApiPropertyOptional({ enum: WorkspaceInvitationStatusEnum })
  @IsEnum(WorkspaceInvitationStatusEnum)
  @IsOptional()
  status?: WorkspaceInvitationStatusEnum

  order?: IOrderObject
  userId?: number
  inviterId?: number
}

export class CreateInvitationDto {
  @ApiProperty()
  @IsNumber()
  @IsDefined()
  userId: number

  inviterId: number
  workspaceId: number
}

export class UpdateInvitationDto {
  @ApiProperty({ enum: WorkspaceInvitationStatusEnum, default: WorkspaceInvitationStatusEnum.ACCEPTED })
  @IsString()
  @IsDefined()
  status: string
}

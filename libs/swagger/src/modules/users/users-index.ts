import { applyDecorators } from '@nestjs/common'
import { ApiOkResponse } from '@nestjs/swagger'
import { getPaginationResponseDto } from '@app/common'
import { UserResponseDto } from '@modules/users/dto/user-response.dto'

export function SwaggerUsersIndex() {
  return applyDecorators(ApiOkResponse({ type: getPaginationResponseDto(UserResponseDto) }))
}

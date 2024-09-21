import { applyDecorators } from '@nestjs/common'
import { ApiOkResponse } from '@nestjs/swagger'
import { UserResponseDto } from '@modules/users/dto/user-response.dto'

export function SwaggerAuthRegister() {
  return applyDecorators(ApiOkResponse({ type: UserResponseDto }))
}

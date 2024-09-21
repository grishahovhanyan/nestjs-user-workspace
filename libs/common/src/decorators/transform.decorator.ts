import { UseInterceptors, applyDecorators } from '@nestjs/common'
import { TransformInterceptor } from '@app/common'

export function TransformResponse<T>(dtoClass: new () => T) {
  return applyDecorators(UseInterceptors(new TransformInterceptor(dtoClass)))
}

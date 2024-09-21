import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { Observable, map } from 'rxjs'

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor {
  constructor(private readonly dtoClass: new () => any) {}

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<T> {
    return next.handle().pipe(
      map((data) => {
        if (data && typeof data === 'object') {
          if ('pages' in data) {
            // Response with pagination
            return { ...data, items: plainToInstance(this.dtoClass, data.items) }
          }
          
          // Regular response
          return plainToInstance(this.dtoClass, data)
        }

        return data // In case of unexpected data, return as is
      })
    )
  }
}

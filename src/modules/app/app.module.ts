import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'

import { envValidationSchema, JwtAuthGuard, RequestLoggerInterceptor } from '@app/common'
import { AppController } from './app.controller'

import { MySqlModule } from '@app/database'
import { AuthModule } from '@modules/auth/auth.module'
import { UsersModule } from '@modules/users/users.module'
import { WorkspacesModule } from '@modules/workspaces/workspaces.module'
import { ChannelsModule } from '@modules/channels/channels.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validationSchema: envValidationSchema
    }),
    MySqlModule,
    AuthModule,
    UsersModule,
    WorkspacesModule,
    ChannelsModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestLoggerInterceptor
    }
  ]
})
export class AppModule {}

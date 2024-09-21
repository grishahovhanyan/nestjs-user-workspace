import 'dotenv/config'
import { initializeTransactionalContext } from 'typeorm-transactional'
import { join } from 'path'
import helmet from 'helmet'
import compression from 'compression'
import { SwaggerModule } from '@nestjs/swagger'
import { NestExpressApplication } from '@nestjs/platform-express'
import { NestFactory } from '@nestjs/core'
import { Logger } from '@nestjs/common'

import { SWAGGER_CONFIGS, SWAGGER_OPTIONS } from '@app/swagger'
import { NodeEnvs, ValidationPipe, getEnvNumber, getEnvString, getNodeEnv } from '@app/common'
import { AppModule } from '@modules/app/app.module'

const logger = new Logger('App')

async function bootstrap() {
  initializeTransactionalContext()

  const nodeEnv = getNodeEnv()

  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.useGlobalPipes(new ValidationPipe())

  app.setGlobalPrefix('api/v1')

  // Enable CORS
  const originArray = getEnvString('CORS_ORIGINS')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
  const origins = originArray.length ? originArray : '*'
  app.enableCors({
    origin: origins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    maxAge: 3600
  })

  // Configure security middlewares
  // Use Helmet to set secure HTTP headers to help protect against well-known vulnerabilities
  app.use(helmet())
  // Trust proxy headers for accurate client IP address detection when behind a reverse proxy
  app.enable('trust proxy')
  // Set strong ETag generation for caching and optimizing responses
  app.set('etag', 'strong')
  // Enable compression to reduce the size of the response bodies and improve loading times
  app.use(compression())

  // Serve static assets from the 'uploads' directory
  // This makes files in the 'uploads' folder accessible at the '/uploads' URL path
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads' })

  const apiHost = getEnvString('API_HOST')
  const apiPort = getEnvNumber('API_PORT', 5000)
  const apiUrl = `${apiHost}:${apiPort}`

  if (nodeEnv !== NodeEnvs.test && nodeEnv !== NodeEnvs.production) {
    const swaggerPath = 'swagger-ui'
    const swaggerDocument = SwaggerModule.createDocument(app, SWAGGER_CONFIGS)
    SwaggerModule.setup(swaggerPath, app, swaggerDocument, SWAGGER_OPTIONS)

    logger.log(`📑 Swagger is running on: ${apiUrl}/${swaggerPath}`)
  }

  await app.listen(apiPort, () => logger.log(`🚀 Application is running on: ${apiUrl}`))
  logger.log(`🚦 Accepting request only from: ${origins}`)
}

bootstrap()

process.on('uncaughtException', (err) => {
  logger.error(err, 'Uncaught exception detected')

  throw err
})

import { ValidationPipe } from '@nestjs/common'
/*Um pipe global fornecido pelo NestJS que lida com a validação automática de payloads de entrada. Ele usa a biblioteca class-validator para validar objetos com base em decoradores.*/
import { NestFactory } from '@nestjs/core'
// Um módulo do NestJS para criar instâncias de aplicativos Nest.
import { AppModule } from './app.module'
//o módulo principal do aplicativo, que geralmente é o ponto de entrada.
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['debug', 'error', 'log', 'warn']
  });

  app.enableCors()

  app.useGlobalPipes(
    new ValidationPipe({//que faz a validação automática de payloads.
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false
      /*
      Configura o uso de um pipe global. No seu caso, é o ValidationPipe que faz a validação automática de payloads.
      transform: true: Converte automaticamente os payloads recebidos para o tipo esperado usando class-transformer.
      whitelist: true: Remove propriedades não decoradas com @ApiModelProperty ou @nestjs/swagger.
      forbidNonWhitelisted: false: Não rejeita solicitações com propriedades não decoradas; elas serão removidas.

      */
    })
  )
  app.setGlobalPrefix('api') // cria a rota global /api
  await app.listen(3000)
}
bootstrap()//É uma função assíncrona que inicializa o aplicativo Nest.

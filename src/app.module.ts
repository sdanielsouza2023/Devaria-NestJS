import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from './auth/auth.module'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './auth/guards/jwt.guard' 
import { UserModule } from './user/user.module'


@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    AuthModule,UserModule
    ],
  controllers: [],
  providers: [
    {provide:APP_GUARD, useClass: JwtAuthGuard}
  ],
})

export class AppModule { }

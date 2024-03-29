import {Controller, Get, Request, BadRequestException, Body, Put, HttpCode, HttpStatus} from '@nestjs/common'
import { UserMessagesHelper } from './helpers/messages.helper'
import { UserService } from './user.service'
import { UpdateUserDto } from './dtos/updateuser.dto'
@Controller('user')
export class UserController{
    constructor(private readonly userService:UserService){}

    @Get()
    async getUser(@Request() req){
        console.log()
        const {userId} = req?.user
        console.log(userId)
        const user = await this.userService.getUserById(userId);

        if(!user){
            throw new BadRequestException(UserMessagesHelper.GET_USER_NOT_FOUND)
        }

        return {
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            id: user._id
        }
    }

    @Put()
    @HttpCode(HttpStatus.OK)
    async updateUser(@Request() req, @Body() dto: UpdateUserDto){
        const {userId} = req?.user;
        await this.userService.updateUser(userId, dto)
    }
}
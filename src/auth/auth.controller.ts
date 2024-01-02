import { Controller, Post, HttpCode, HttpStatus, Body } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { LoginDto } from "./dtos/login.dto"

@Controller("auth")
export class AuthController{
    constructor(private readonly authService: AuthService){}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() dto: LoginDto){
        return this.authService.login(dto)
        //está chamando o método login da instância da classe AuthService. Este método 
    }
}
//nesta parte do código é onde os dados do cliente são recebidos e processados durante a rota de login. O LoginDto é responsável por definir a estrutura dos dados esperados no corpo da requisição.
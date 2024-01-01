import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import * as bcrypt from 'bcrypt'

@Controller("api")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }



  @Post("register")
  async register(
    @Body('name') name:string, 
    @Body('phonenumber') phonenumber:string, 
    @Body('email') email:string, 
    @Body('password') password:string, 
    ){

      const hashedPassword = await bcrypt.hash(password,12)

      const requestBody = this.appService.register({name,phonenumber,email,hashedPassword})
      return requestBody
  }
}
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/danmigwi24/dk-backend-nestjs.git
git push -u origin main
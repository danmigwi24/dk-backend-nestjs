import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import * as bcrypt from 'bcrypt';


@Controller("api")
export class AppController {
  constructor(private readonly appService: AppService) {}
//
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

//
  @Post("register")
  async register(
    @Body('name') name:string, 
    @Body('phonenumber') phonenumber:string, 
    @Body('email') email:string, 
    @Body('password') password:string, 
    ){
      const saltOrRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltOrRounds);
      
      //console.log(`PASSWORD: ${password}`);
      console.log(`HASHED PASSWORD: ${hashedPassword}`);

      const requestBody = this.appService.register(
       {
          name,
          phonenumber,
          email,
          password:hashedPassword
        })
      return requestBody
  }

  //
  @Post("login")
  async login(
    @Body('phonenumber') phonenumber:string,
    @Body('password') password:string, 
  ){

   // const user = await this.appService.login({phonenumber})
    const user = await this.appService.findOneBy(phonenumber)
      if(!user){
        throw new BadRequestException("Invalid credentials")
      }
      const isMatch = await bcrypt.compare(password, user.password);
      console.log(`USER: ${JSON.stringify(user,null,2)}`);
      if (isMatch){
        delete user.password;
        return user
      }else{
        throw new BadRequestException("Invalid credentials") 
      }
  }
//
  @Post('getallusers')
  async getAllUsers(){
    const users = await this.appService.getAllUsers()
    return users
  }
//
  @Post('findById')
  async findById(
    @Body('phonenumber') phonenumber:string,
  ){
    const users = await this.appService.findOneBy(phonenumber)
    return users
  }

}

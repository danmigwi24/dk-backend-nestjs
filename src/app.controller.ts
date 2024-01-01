import { BadRequestException, Body, Controller, Get, Param, Post, Req, Res, UnauthorizedException, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { Request } from 'express';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editedFileName } from './helpers/file.helper';


@Controller("api")
export class AppController {
  constructor(
    private readonly appService: AppService,
    private jwtService: JwtService
  ) { }
  //
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  //
  @Post("register")
  async register(
    @Body('name') name: string,
    @Body('phonenumber') phonenumber: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const saltOrRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

    //console.log(`PASSWORD: ${password}`);
    console.log(`HASHED PASSWORD: ${hashedPassword}`);

    const requestBody = await this.appService.register(
      {
        name,
        phonenumber,
        email,
        password: hashedPassword
      })

    delete requestBody.password

    return requestBody
  }

  //
  @Post("login")
  async login(
    @Body('phonenumber') phonenumber: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response
  ) {

    // const user = await this.appService.login({phonenumber})
    const user = await this.appService.findOneBy(phonenumber)
    if (!user) {
      throw new BadRequestException("Invalid credentials")
    }
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`USER: ${JSON.stringify(user, null, 2)}`);
    if (isMatch) {
      delete user.password;

      const jwt = await this.jwtService.signAsync({ id: user.id, phonenumber: user.phonenumber })
      response.cookie('jwt', jwt, { httpOnly: true })
      //user.accessToken = jwt;
      return { status: 200, accessToken: jwt, data: user }
    } else {
      throw new BadRequestException("Invalid credentials")
    }
  }
  //
  @Post('users')
  async allUsers(@Req() request: Request) {
    try {
      const cookie = request.cookies['jwt']
      const data = await this.jwtService.verifyAsync(cookie)

      if (!data) {
        throw new UnauthorizedException()
      } else {
        const users = await this.appService.getAllUsers()
        const user = await this.appService.findOneBy(data['phonenumber'])
        const { password, ...result } = user
        return result
      }

    } catch (error) {
      throw new UnauthorizedException()
    }

  }
  //
  @Post('logout')
  async logout(
    @Res({ passthrough: true }) response: Response
  ) {
    response.clearCookie('jwt')
    return { status: 200, message: "Logged out" }
  }

  //
  @Post('getallusers')
  async getAllUsers() {
    const users = await this.appService.getAllUsers()
    return users
  }
  //
  @Post('findById')
  async findById(
    @Body('id') id: number,
  ) {
    const users = await this.appService.findById(id)
    return users
  }

  //
  @Post('upload')
  @UseInterceptors(
    FileInterceptor(
      'file',
      {
        storage: diskStorage({
          destination:'./uploads',
          //filename: editedFileName
        }),
        //fileFilter: imageFileFilter
      }
    )
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    const response = {
      originalname: file.originalname,
      filename: file.filename
    }

    return response
  }

  //
  @Post('uploadmany')
  @UseInterceptors(FilesInterceptor('files'))
  uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(files);

  }

  //
  @Get(':imagepath')
  seeUploadedFile(@Param('imgpath') image, @Res() res) {
    return res.sendFile(image, { root: 'uploads' })
  }
}

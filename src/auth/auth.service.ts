import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { LoginDto, RegisterDto } from "./dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { User } from "src/user/user.entity";

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private jwtService: JwtService
    ) { }

    async login(dto: LoginDto) {
        // const user = await this.appService.login({phonenumber})
        const user = await this.findOneBy(dto.phonenumber);
        if (!user) {
            throw new BadRequestException("Invalid credentials")
        }
        const isMatch = await bcrypt.compare(dto.password, user.password);
        console.log(`USER: ${JSON.stringify(user, null, 2)}`);
        if (isMatch) {
            delete user.password;

            const jwt = await this.jwtService.signAsync({ id: user.id, phonenumber: user.phonenumber })

            //user.accessToken = jwt;
            return { status: 200, accessToken: jwt, data: user }
        } else {
            throw new BadRequestException("Invalid credentials")
        }
    }

    async signup(dto: RegisterDto) {
        console.log(`DATA \n ${JSON.stringify(dto, null, 2)}`)
        try {
            const saltOrRounds = 12;
            const hashedPassword = await bcrypt.hash(dto.password, saltOrRounds);
            dto.password = hashedPassword
            console.log(`PASSWORD: ${dto.password}`);
            console.log(`HASHED PASSWORD: ${dto}`);
            const data = this.userRepository.save(dto);
            delete (await data).password
            //return { message: dto}
            return { status: 200, message: "Success", data }
        } catch (error) {
            throw new HttpException('USER EXISTS', HttpStatus.OK);
        }

    }

    private async findOneBy(phonenumber: string): Promise<User | null> {
        return this.userRepository.findOneBy({ phonenumber });
    }

/**
 * 
 * @param data 
 * @returns 
  




  async registerAuth(data: any): Promise<RegisterDto> {
    console.log(`DATA \n ${JSON.stringify(data,null,2)}`)
    return this.userRepository.save(data);
  }

  async loginAuth(data: any): Promise<LoginDto | null> {
    return this.userRepository.findOne(data);
  }

  async findOneByAuth(phonenumber: string): Promise<LoginDto | null> {
    return this.userRepository.findOneBy({ phonenumber });
  }
   async findByIdAuth(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async getAllUsersAuth(): Promise<User[]> {
    return this.userRepository.find()
  }
   */
}

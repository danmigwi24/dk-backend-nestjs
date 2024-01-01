import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User) private readonly userRepository:Repository<User>
  ){}
  
  getHello(): string {
    return 'Hello World!';
  }

  async register(data:any):Promise<User>{
return this.userRepository.save(data)
  }
  
}

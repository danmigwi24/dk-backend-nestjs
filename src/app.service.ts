import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) { }

  getHello(): string {
    return 'Hello World!';
  }

  async register(data: any): Promise<User> {
    console.log(`DATA \n ${JSON.stringify(data,null,2)}`)
    return this.userRepository.save(data);
  }

  async login(data: any): Promise<User | null> {
    return this.userRepository.findOne(data);
  }

  async findOneBy(phonenumber: string): Promise<User | null> {
    return this.userRepository.findOneBy({ phonenumber });
  }
   async findById(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }



  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find()
  }
}

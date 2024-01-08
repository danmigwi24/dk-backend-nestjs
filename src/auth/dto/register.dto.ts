import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class RegisterDto {
    //
    @IsString()
    @IsNotEmpty()
    name: string;
    //
    @IsString()
    @IsNotEmpty()
    phonenumber: string;
    //
    @IsEmail()
    @IsNotEmpty()
    email: string;
    //
    @IsString()
    @IsNotEmpty()
    password: string;
}
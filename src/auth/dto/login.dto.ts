import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
    //
    @IsString()
    @IsNotEmpty()
    phonenumber: string;
    //
    //@IsEmail()
    //@IsNotEmpty()
    //email: string;
    //
    @IsString()
    @IsNotEmpty()
    password: string;
}
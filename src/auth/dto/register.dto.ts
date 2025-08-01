import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterDto {
    @IsEmail({}, { message: "Please provide a valid email" })
    @IsNotEmpty({ message: "email is required" })
    email: string

    @IsNotEmpty({ message: "name is required" })
    @IsString({ message: "name must be a string" })
    name: string

    @IsNotEmpty({ message: "password is required" })
    @MinLength(3, { message: "password must be at least 3 characters long" })
    password: string

}
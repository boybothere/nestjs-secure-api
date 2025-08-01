import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class LoginDto {
    @IsEmail({}, { message: "Please provide a valid email" })
    @IsNotEmpty({ message: "email is required" })
    email: string

    @IsNotEmpty({ message: "password is required" })
    @MinLength(3, { message: "password must be at least 3 characters long" })
    password: string

}
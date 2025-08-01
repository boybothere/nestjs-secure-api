import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { User } from "src/auth/entities/user.entity";

export class CreatePostDto {


    @IsNotEmpty({ message: "title is required" })
    @IsString({ message: "title must be a string" })
    @MinLength(3, { message: "Tile must be at least 3 characters long" })
    @MaxLength(50, { message: "Title cannot be longer than 50 characters" })
    title: string

    @IsNotEmpty({ message: "content is required" })
    @IsString({ message: "content must be a string" })
    @MinLength(5, { message: "content must be at least 5 characters long" })
    content: string
}
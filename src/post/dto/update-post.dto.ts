import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdatePostDto {

    @IsOptional()
    @IsNotEmpty({ message: "title is requited" })
    @IsString({ message: "title must be a string" })
    @MinLength(3, { message: "Tile must be at least 3 characters long" })
    @MaxLength(50, { message: "Title cannot be longer than 50 characters" })
    title?: string

    @IsOptional()
    @IsNotEmpty({ message: "content is requited" })
    @IsString({ message: "content must be a string" })
    @MinLength(5, { message: "content must be at least 5 characters long" })
    content?: string

}
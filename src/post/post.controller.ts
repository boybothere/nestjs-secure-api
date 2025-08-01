import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Delete, UseGuards, Patch } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostExistsPipe } from './pipes/post-exists.pipe';
import { Post as POST } from './entities/post.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User, UserRole } from 'src/auth/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) { }

    @Get()
    async findAll(): Promise<POST[]> {
        return await this.postService.findAll()
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe, PostExistsPipe) id: number): Promise<POST> {
        return await this.postService.findOne(id)
    }

    @UseGuards(JwtAuthGuard)
    @Post('')
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createPostData: CreatePostDto, @CurrentUser() user: User): Promise<POST> {
        console.log('Current User:', user);

        return await this.postService.createPost(createPostData, user)
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async update(@Param('id', ParseIntPipe, PostExistsPipe) id: number,
        @Body() updateDetails: UpdatePostDto,
        @CurrentUser() user: any): Promise<POST> {
        console.log('Current User:', user);
        return await this.postService.update(id, updateDetails, user)
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe, PostExistsPipe) id: number) {
        return await this.postService.delete(id)
    }
}

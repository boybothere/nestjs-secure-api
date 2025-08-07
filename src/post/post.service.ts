import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class PostService {
    constructor(@InjectRepository(Post) private postRepository: Repository<Post>
    ) { }


    async findAll() {
        return await this.postRepository.find({
            relations: ['authorName']
        })
    }
    async findOne(id: number): Promise<Post> {
        const post = await this.postRepository.findOne({
            where: { id },
            relations: ['authorName']
        })
        if (!post) throw new NotFoundException(`Post with ID ${id} is not found!`)
        return post
    }

    async createPost(createPostData: CreatePostDto, author: User): Promise<Post> {
        const { password, ...rest } = author
        const newPost = this.postRepository.create({
            ...createPostData,
            authorName: rest
        })
        return await this.postRepository.save(newPost)

    }

    async update(id: number, updatePostData: UpdatePostDto, user: any): Promise<Post> {
        const findPostToUpdate = await this.findOne(id)
        if (findPostToUpdate.authorName.id !== user.id) throw new ForbiddenException('Invalid permissions to edit post')
        if (!findPostToUpdate) throw new NotFoundException("Post doesn't exist")
        Object.assign(findPostToUpdate, updatePostData)
        return await this.postRepository.save(findPostToUpdate)
    }

    async delete(id: number): Promise<void> {
        const postToRemove = await this.findOne(id)
        if (!postToRemove.id) throw new NotFoundException
        await this.postRepository.delete(postToRemove.id)
    }
}


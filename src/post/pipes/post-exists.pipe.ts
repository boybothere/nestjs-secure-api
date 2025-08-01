import { ArgumentMetadata, Injectable, NotFoundException, PipeTransform } from "@nestjs/common";
import { PostService } from "../post.service";

@Injectable()
export class PostExistsPipe implements PipeTransform {
    constructor(private readonly postService: PostService) { }

    async transform(value: any, metadata: ArgumentMetadata) {

        const post = await this.postService.findOne(value)

        if (!post) throw new NotFoundException(`Hey post with given ID ${value} doesn't exist here`)

        return value
    }
}
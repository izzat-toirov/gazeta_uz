import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto, UpdatePostDto, GetPostsQueryDto } from './dto/post.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PostsService {
    constructor(private prisma: PrismaService) { }

    async create(createPostDto: CreatePostDto) {
        const { translations, tagIds, ...data } = createPostDto;
        return this.prisma.post.create({
            data: {
                ...data,
                translations: {
                    create: translations,
                },
                tags: {
                    connect: tagIds?.map((id) => ({ id })) || [],
                },
            },
            include: {
                translations: true,
                tags: true,
                author: true,
                category: true,
            },
        });
    }

    async findAll(query: GetPostsQueryDto) {
        const { categoryId, tagId, authorId, status, skip, take, search } = query;

        const where: Prisma.PostWhereInput = {
            AND: [
                categoryId ? { categoryId } : {},
                tagId ? { tags: { some: { id: tagId } } } : {},
                authorId ? { authorId } : {},
                status ? { status } : {},
                search ? {
                    translations: {
                        some: {
                            OR: [
                                { title: { contains: search, mode: 'insensitive' } },
                                { content: { contains: search, mode: 'insensitive' } },
                            ],
                        },
                    },
                } : {},
            ],
        };

        return this.prisma.post.findMany({
            where,
            skip,
            take,
            include: {
                translations: true,
                tags: { include: { translations: true } },
                author: true,
                category: { include: { translations: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getTrending(limit: number = 5) {
        return this.prisma.post.findMany({
            where: { status: 'PUBLISHED' },
            take: limit,
            include: {
                translations: true,
                tags: { include: { translations: true } },
                author: true,
                category: { include: { translations: true } },
            },
            orderBy: { viewCount: 'desc' },
        });
    }

    async findOne(id: number) {
        // Increment view count
        await this.prisma.post.update({
            where: { id },
            data: { viewCount: { increment: 1 } },
        });

        return this.prisma.post.findUnique({
            where: { id },
            include: {
                translations: true,
                tags: { include: { translations: true } },
                author: true,
                category: { include: { translations: true } },
                media: true,
                comments: { include: { user: true } },
            },
        });
    }

    async update(id: number, updatePostDto: UpdatePostDto) {
        const { translations, tagIds, ...data } = updatePostDto;

        await this.prisma.postTranslation.deleteMany({
            where: { postId: id },
        });

        return this.prisma.post.update({
            where: { id },
            data: {
                ...data,
                translations: {
                    create: translations,
                },
                tags: {
                    set: tagIds.map((id) => ({ id })),
                },
            },
            include: {
                translations: true,
                tags: true,
            },
        });
    }

    async remove(id: number) {
        return this.prisma.post.delete({
            where: { id },
        });
    }
}

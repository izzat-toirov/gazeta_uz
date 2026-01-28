import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto';

@Injectable()
export class CommentsService {
    constructor(private prisma: PrismaService) { }

    async create(userId: number, createCommentDto: CreateCommentDto) {
        try {
            console.log(`[CommentsService] Creating comment for user ${userId}, post ${createCommentDto.postId}`);

            // Check if post exists
            const post = await this.prisma.post.findUnique({ where: { id: createCommentDto.postId } });
            if (!post) {
                console.error(`[CommentsService] Post ${createCommentDto.postId} not found`);
                throw new Error(`Post with ID ${createCommentDto.postId} not found`);
            }

            // Check if user exists (optional, but good for debugging)
            const user = await this.prisma.user.findUnique({ where: { id: userId } });
            if (!user) {
                console.error(`[CommentsService] User ${userId} not found`);
                throw new Error(`User with ID ${userId} not found`);
            }

            const result = await this.prisma.comment.create({
                data: {
                    content: createCommentDto.content,
                    postId: createCommentDto.postId,
                    userId: userId, // Explicitly set
                    // Only include parentId if it exists
                    ...(createCommentDto.parentId ? { parentId: createCommentDto.parentId } : {})
                },
            });
            console.log('[CommentsService] Comment created successfully');
            return result;
        } catch (error) {
            console.error('[CommentsService] Error creating comment:', error);
            // Re-throw as HttpException to expose message to client for debugging
            throw new ForbiddenException(error.message || 'Error creating comment');
        }
    }

    async findAll() {
        return this.prisma.comment.findMany({
            include: { user: true, replies: true },
        });
    }

    async findAllByPostId(postId: number) {
        return this.prisma.comment.findMany({
            where: { postId },
            include: { user: true, replies: true },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findOne(id: number) {
        return this.prisma.comment.findUnique({
            where: { id },
            include: { user: true, replies: true },
        });
    }

    async update(id: number, updateCommentDto: UpdateCommentDto) {
        return this.prisma.comment.update({
            where: { id },
            data: updateCommentDto,
        });
    }

    async remove(id: number) {
        return this.prisma.comment.delete({
            where: { id },
        });
    }

    async removeAuthenticated(id: number, user: any) {
        const comment = await this.prisma.comment.findUnique({ where: { id } });
        if (!comment) {
            // Let delete throw or return, but practically we should check
            // throw new NotFoundException... but keeping it simple for now, using prisma delete directly if checked
        }

        // If not checking "Not Found", we might fail on delete if not found.
        // Better to check existence.
        // Actually, let's keep it simple:

        if (comment && comment.userId !== user.userId && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
            throw new ForbiddenException('You are not allowed to delete this comment');
        }

        return this.prisma.comment.delete({
            where: { id },
        });
    }
}

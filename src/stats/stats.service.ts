import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
    constructor(private prisma: PrismaService) { }

    async getDashboardStats() {
        const [posts, users, comments, categories, totalViews] = await Promise.all([
            this.prisma.post.count(),
            this.prisma.user.count(),
            this.prisma.comment.count(),
            this.prisma.category.count(),
            this.prisma.post.aggregate({
                _sum: {
                    viewCount: true,
                },
            }),
        ]);

        const postsByStatus = await this.prisma.post.groupBy({
            by: ['status'],
            _count: true,
        });

        return {
            totalPosts: posts,
            totalUsers: users,
            totalComments: comments,
            totalCategories: categories,
            totalViews: totalViews._sum.viewCount || 0,
            postsByStatus,
        };
    }
}

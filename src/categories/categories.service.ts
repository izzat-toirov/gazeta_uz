import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService) { }

    async create(createCategoryDto: CreateCategoryDto) {
        const { translations, ...data } = createCategoryDto;
        return this.prisma.category.create({
            data: {
                ...data,
                translations: {
                    create: translations,
                },
            },
            include: { translations: true },
        });
    }

    async findAll() {
        return this.prisma.category.findMany({
            include: { translations: true, children: true },
        });
    }

    async findOne(id: number) {
        return this.prisma.category.findUnique({
            where: { id },
            include: { translations: true, children: true },
        });
    }

    async update(id: number, updateCategoryDto: UpdateCategoryDto) {
        const { translations, ...data } = updateCategoryDto;

        // Simplistic update: delete old translations and create new ones
        // In production, better to use upsert or specific update logic
        await this.prisma.categoryTranslation.deleteMany({
            where: { categoryId: id },
        });

        return this.prisma.category.update({
            where: { id },
            data: {
                ...data,
                translations: {
                    create: translations,
                },
            },
            include: { translations: true },
        });
    }

    async remove(id: number) {
        return this.prisma.category.delete({
            where: { id },
        });
    }
}

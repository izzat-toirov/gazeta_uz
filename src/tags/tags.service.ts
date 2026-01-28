import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagDto, UpdateTagDto } from './dto/tag.dto';

@Injectable()
export class TagsService {
    constructor(private prisma: PrismaService) { }

    async create(createTagDto: CreateTagDto) {
        const { translations, ...data } = createTagDto;
        return this.prisma.tag.create({
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
        return this.prisma.tag.findMany({
            include: { translations: true },
        });
    }

    async findOne(id: number) {
        return this.prisma.tag.findUnique({
            where: { id },
            include: { translations: true },
        });
    }

    async update(id: number, updateTagDto: UpdateTagDto) {
        const { translations, ...data } = updateTagDto;

        await this.prisma.tagTranslation.deleteMany({
            where: { tagId: id },
        });

        return this.prisma.tag.update({
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
        return this.prisma.tag.delete({
            where: { id },
        });
    }
}

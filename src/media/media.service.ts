import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMediaDto, UpdateMediaDto } from './dto/media.dto';

@Injectable()
export class MediaService {
    constructor(private prisma: PrismaService) { }

    async create(createMediaDto: CreateMediaDto) {
        return this.prisma.media.create({
            data: createMediaDto,
        });
    }

    async findAll() {
        return this.prisma.media.findMany();
    }

    async findOne(id: number) {
        return this.prisma.media.findUnique({
            where: { id },
        });
    }

    async update(id: number, updateMediaDto: UpdateMediaDto) {
        return this.prisma.media.update({
            where: { id },
            data: updateMediaDto,
        });
    }

    async remove(id: number) {
        return this.prisma.media.delete({
            where: { id },
        });
    }
}

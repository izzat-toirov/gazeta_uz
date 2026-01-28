import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReactionDto } from './dto/reaction.dto';

@Injectable()
export class ReactionsService {
    constructor(private prisma: PrismaService) { }

    async create(createReactionDto: CreateReactionDto) {
        return this.prisma.reaction.create({
            data: createReactionDto,
        });
    }

    async findAll() {
        return this.prisma.reaction.findMany();
    }

    async remove(id: number) {
        return this.prisma.reaction.delete({
            where: { id },
        });
    }
}

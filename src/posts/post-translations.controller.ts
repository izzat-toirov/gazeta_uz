import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Post Translations')
@Controller('post-translations')
export class PostTranslationsController {
    constructor(private prisma: PrismaService) { }

    @Get()
    @ApiOperation({ summary: 'Get all post translations (Internal use)' })
    findAll() {
        return this.prisma.postTranslation.findMany();
    }
}

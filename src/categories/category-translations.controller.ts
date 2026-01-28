import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Category Translations')
@Controller('category-translations')
export class CategoryTranslationsController {
    constructor(private prisma: PrismaService) { }

    @Get()
    @ApiOperation({ summary: 'Get all category translations (Internal use)' })
    findAll() {
        return this.prisma.categoryTranslation.findMany();
    }
}

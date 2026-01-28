import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TagsService } from './tags.service';
import { CreateTagDto, UpdateTagDto } from './dto/tag.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Tags')
@Controller('tags')
export class TagsController {
    constructor(private readonly tagsService: TagsService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.EDITOR)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new tag (Protected: ADMIN, EDITOR)' })
    @ApiResponse({ status: 201, description: 'Tag created successfully' })
    create(@Body() createTagDto: CreateTagDto) {
        return this.tagsService.create(createTagDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all tags with translations' })
    findAll() {
        return this.tagsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a specific tag by ID' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.tagsService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.EDITOR)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update a tag (Protected: ADMIN, EDITOR)' })
    update(@Param('id', ParseIntPipe) id: number, @Body() updateTagDto: UpdateTagDto) {
        return this.tagsService.update(id, updateTagDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a tag (Protected: ADMIN)' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.tagsService.remove(id);
    }
}

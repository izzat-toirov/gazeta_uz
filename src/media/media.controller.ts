import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MediaService } from './media.service';
import { CreateMediaDto, UpdateMediaDto } from './dto/media.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Media')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('media')
export class MediaController {
    constructor(private readonly mediaService: MediaService) { }

    @Post()
    @Roles(Role.ADMIN, Role.EDITOR, Role.AUTHOR)
    @ApiOperation({ summary: 'Link a media file with an article (ADMIN, EDITOR, AUTHOR)' })
    create(@Body() createMediaDto: CreateMediaDto) {
        return this.mediaService.create(createMediaDto);
    }

    @Get()
    @Roles(Role.ADMIN, Role.EDITOR)
    @ApiOperation({ summary: 'Get all media files (ADMIN, EDITOR)' })
    findAll() {
        return this.mediaService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get media details' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.mediaService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.ADMIN, Role.EDITOR)
    @ApiOperation({ summary: 'Update media info (ADMIN, EDITOR)' })
    update(@Param('id', ParseIntPipe) id: number, @Body() updateMediaDto: UpdateMediaDto) {
        return this.mediaService.update(id, updateMediaDto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN, Role.EDITOR)
    @ApiOperation({ summary: 'Delete media ref (ADMIN, EDITOR)' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.mediaService.remove(id);
    }
}

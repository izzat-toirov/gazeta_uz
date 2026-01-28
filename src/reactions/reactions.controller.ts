import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReactionsService } from './reactions.service';
import { CreateReactionDto } from './dto/reaction.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Reactions')
@Controller('reactions')
export class ReactionsController {
    constructor(private readonly reactionsService: ReactionsService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Add a reaction to an article (Protected)' })
    @ApiResponse({ status: 201, description: 'Reaction added successfully' })
    create(@Body() createReactionDto: CreateReactionDto) {
        return this.reactionsService.create(createReactionDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all reactions' })
    findAll() {
        return this.reactionsService.findAll();
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Remove a reaction (Protected: ADMIN)' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.reactionsService.remove(id);
    }
}

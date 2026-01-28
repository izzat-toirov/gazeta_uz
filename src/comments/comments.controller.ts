import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new comment (Protected)' })
    @ApiResponse({ status: 201, description: 'Comment created successfully' })
    create(@Request() req, @Body() createCommentDto: CreateCommentDto) {
        console.log('Detected user:', req.user);
        console.log('Body:', createCommentDto);
        return this.commentsService.create(req.user.userId, createCommentDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all comments' })
    findAll() {
        return this.commentsService.findAll();
    }

    @Get('post/:postId')
    @ApiOperation({ summary: 'Get all comments for a specific post' })
    findAllByPostId(@Param('postId', ParseIntPipe) postId: number) {
        return this.commentsService.findAllByPostId(postId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a specific comment by ID' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.commentsService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update a comment (Protected)' })
    update(@Param('id', ParseIntPipe) id: number, @Body() updateCommentDto: UpdateCommentDto) {
        return this.commentsService.update(id, updateCommentDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a comment (Protected: Owner or ADMIN)' })
    remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.commentsService.removeAuthenticated(id, req.user);
    }
}

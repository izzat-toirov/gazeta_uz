import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto, GetPostsQueryDto } from './dto/post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.EDITOR, Role.AUTHOR)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new article (Protected: ADMIN, EDITOR, AUTHOR)' })
    @ApiResponse({ status: 201, description: 'Article created successfully' })
    create(@Body() createPostDto: CreatePostDto) {
        return this.postsService.create(createPostDto);
    }

    @Get('trending')
    @ApiOperation({ summary: 'Get trending articles (most viewed)' })
    getTrending(@Query('limit', ParseIntPipe) limit: number) {
        return this.postsService.getTrending(limit || 5);
    }

    @Get()
    @ApiOperation({ summary: 'Get all articles with filters and pagination' })
    findAll(@Query() query: GetPostsQueryDto) {
        return this.postsService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get article details including media and comments' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.postsService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.EDITOR)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update an article (Protected: ADMIN, EDITOR)' })
    update(@Param('id', ParseIntPipe) id: number, @Body() updatePostDto: UpdatePostDto) {
        return this.postsService.update(id, updatePostDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete an article (Protected: ADMIN)' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.postsService.remove(id);
    }
}

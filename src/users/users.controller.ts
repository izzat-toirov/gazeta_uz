import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Create a new user (Protected: ADMIN)' })
    @ApiResponse({ status: 201, description: 'User created successfully' })
    create(@Body() createUserDto: CreateUserDto, @Req() req: any) {
        return this.usersService.create(createUserDto, req.user.role);
    }

    @Get()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Get all users (Protected: ADMIN)' })
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.EDITOR)
    @ApiOperation({ summary: 'Get a specific user by ID (Protected: ADMIN, EDITOR)' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Update a user (Protected: ADMIN)' })
    update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto, @Req() req: any) {
        return this.usersService.update(id, updateUserDto, req.user.role);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Delete a user (Protected: ADMIN)' })
    remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
        return this.usersService.remove(id, req.user.role);
    }
}

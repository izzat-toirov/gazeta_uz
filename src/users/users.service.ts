import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async create(createUserDto: CreateUserDto, requesterRole: Role) {
        // Only SUPER_ADMIN can create ADMIN or SUPER_ADMIN
        if (
            (createUserDto.role === Role.ADMIN || createUserDto.role === Role.SUPER_ADMIN) &&
            requesterRole !== Role.SUPER_ADMIN
        ) {
            throw new ForbiddenException('Only SUPER_ADMIN can create ADMIN or SUPER_ADMIN users');
        }

        if (createUserDto.password) {
            createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
        }

        const user = await this.prisma.user.create({
            data: createUserDto as any,
        });

        const { password: _, ...result } = user as any;
        return result;
    }

    async findAll() {
        return this.prisma.user.findMany();
    }

    async findOne(id: number) {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    async update(id: number, updateUserDto: UpdateUserDto, requesterRole: Role) {
        const targetUser = await this.prisma.user.findUnique({ where: { id } });
        if (!targetUser) throw new NotFoundException('User not found');

        // Protect SUPER_ADMIN and ADMIN from non-SUPER_ADMIN
        if (
            (targetUser.role === Role.SUPER_ADMIN || targetUser.role === Role.ADMIN) &&
            requesterRole !== Role.SUPER_ADMIN
        ) {
            throw new ForbiddenException('Only SUPER_ADMIN can modify ADMIN or SUPER_ADMIN users');
        }

        // Prevent non-SUPER_ADMIN from promoting anyone to ADMIN or SUPER_ADMIN
        if (
            updateUserDto.role &&
            (updateUserDto.role === Role.ADMIN || updateUserDto.role === Role.SUPER_ADMIN) &&
            requesterRole !== Role.SUPER_ADMIN
        ) {
            throw new ForbiddenException('Only SUPER_ADMIN can assign ADMIN or SUPER_ADMIN roles');
        }

        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }

        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: updateUserDto,
        });

        const { password: _, ...result } = updatedUser as any;
        return result;
    }

    async remove(id: number, requesterRole: Role) {
        const targetUser = await this.prisma.user.findUnique({ where: { id } });
        if (!targetUser) throw new NotFoundException('User not found');

        // Only SUPER_ADMIN can delete ADMIN or SUPER_ADMIN
        if (
            (targetUser.role === Role.SUPER_ADMIN || targetUser.role === Role.ADMIN) &&
            requesterRole !== Role.SUPER_ADMIN
        ) {
            throw new ForbiddenException('Only SUPER_ADMIN can delete ADMIN or SUPER_ADMIN users');
        }

        return this.prisma.user.delete({
            where: { id },
        });
    }
}

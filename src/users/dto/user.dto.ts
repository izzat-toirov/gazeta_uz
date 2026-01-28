import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsEnum, IsUrl, MinLength } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    @MinLength(6)
    @IsOptional()
    password: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    bio?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUrl()
    avatarUrl?: string;

    @ApiProperty({ enum: Role, default: Role.AUTHOR })
    @IsOptional()
    @IsEnum(Role)
    role?: Role;
}

export class UpdateUserDto extends CreateUserDto { }

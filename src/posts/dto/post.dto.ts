import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsArray, ValidateNested, IsInt, IsUrl, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { Language, PostStatus } from '@prisma/client';

export class PostTranslationDto {
    @ApiProperty({ enum: Language })
    @IsEnum(Language)
    language: Language;

    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    lead?: string;

    @ApiProperty()
    @IsString()
    content: string;
}

export class CreatePostDto {
    @ApiProperty()
    @IsString()
    slug: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUrl()
    thumbnailUrl?: string;

    @ApiProperty({ enum: PostStatus, default: PostStatus.DRAFT })
    @IsOptional()
    @IsEnum(PostStatus)
    status?: PostStatus;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsDateString()
    publishedAt?: Date;

    @ApiProperty()
    @IsInt()
    authorId: number;

    @ApiProperty()
    @IsInt()
    categoryId: number;

    @ApiProperty({ type: [Number], description: 'Array of Tag IDs' })
    @IsArray()
    @IsInt({ each: true })
    tagIds: number[];

    @ApiProperty({ type: [PostTranslationDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PostTranslationDto)
    translations: PostTranslationDto[];
}

export class UpdatePostDto extends CreatePostDto { }

export class GetPostsQueryDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    categoryId?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    tagId?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    authorId?: number;

    @ApiProperty({ required: false, enum: PostStatus })
    @IsOptional()
    @IsEnum(PostStatus)
    status?: PostStatus;

    @ApiProperty({ required: false, default: 0 })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    skip?: number = 0;

    @ApiProperty({ required: false, default: 10 })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    take?: number = 10;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    search?: string;
}

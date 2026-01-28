import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsArray, ValidateNested, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { Language } from '@prisma/client';

export class CategoryTranslationDto {
    @ApiProperty({ enum: Language })
    @IsEnum(Language)
    language: Language;

    @ApiProperty()
    @IsString()
    name: string;
}

export class CreateCategoryDto {
    @ApiProperty()
    @IsString()
    slug: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()
    parentId?: number;

    @ApiProperty({ type: [CategoryTranslationDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CategoryTranslationDto)
    translations: CategoryTranslationDto[];
}

export class UpdateCategoryDto extends CreateCategoryDto { }

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Language } from '@prisma/client';

export class TagTranslationDto {
    @ApiProperty({ enum: Language })
    @IsEnum(Language)
    language: Language;

    @ApiProperty()
    @IsString()
    name: string;
}

export class CreateTagDto {
    @ApiProperty()
    @IsString()
    slug: string;

    @ApiProperty({ type: [TagTranslationDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TagTranslationDto)
    translations: TagTranslationDto[];
}

export class UpdateTagDto extends CreateTagDto { }

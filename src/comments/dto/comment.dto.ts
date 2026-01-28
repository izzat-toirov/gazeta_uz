import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCommentDto {
    @ApiProperty()
    @IsString()
    content: string;


    @ApiProperty()
    @IsInt()
    @Type(() => Number)
    postId: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    parentId?: number;
}

export class UpdateCommentDto extends CreateCommentDto { }

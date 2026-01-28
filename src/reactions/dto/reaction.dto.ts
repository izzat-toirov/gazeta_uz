import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateReactionDto {
    @ApiProperty({ description: 'like, love, sad, etc.' })
    @IsString()
    type: string;

    @ApiProperty()
    @IsInt()
    postId: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()
    userId?: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsUrl } from 'class-validator';

export class CreateMediaDto {
    @ApiProperty()
    @IsUrl()
    url: string;

    @ApiProperty({ description: 'photo, video, or infographic' })
    @IsString()
    type: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    caption?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()
    postId?: number;
}

export class UpdateMediaDto extends CreateMediaDto { }

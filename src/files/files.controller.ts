import {
    Controller,
    Post,
    Get,
    Delete,
    Param,
    UseInterceptors,
    UploadedFile,
    UploadedFiles,
    ParseIntPipe,
    UseGuards,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { ApiTags, ApiConsumes, ApiBody, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Files')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('files')
export class FilesController {
    constructor(private readonly filesService: FilesService) { }

    @Post('upload')
    @Roles(Role.ADMIN, Role.EDITOR, Role.AUTHOR)
    @ApiOperation({ summary: 'Upload a single file (ADMIN, EDITOR, AUTHOR)' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: { type: 'string', format: 'binary' },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        return this.filesService.uploadSingle(file);
    }

    @Post('upload-multiple')
    @Roles(Role.ADMIN, Role.EDITOR, Role.AUTHOR)
    @ApiOperation({ summary: 'Upload multiple files (ADMIN, EDITOR, AUTHOR)' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                files: {
                    type: 'array',
                    items: { type: 'string', format: 'binary' },
                },
            },
        },
    })
    @UseInterceptors(FilesInterceptor('files'))
    uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
        return this.filesService.uploadMultiple(files);
    }

    @Get()
    @Roles(Role.ADMIN, Role.EDITOR)
    @ApiOperation({ summary: 'Get all files (ADMIN, EDITOR)' })
    findAll() {
        return this.filesService.findAll();
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.EDITOR)
    @ApiOperation({ summary: 'Get file by ID (ADMIN, EDITOR)' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.filesService.findOne(id);
    }

    @Delete(':id')
    @Roles(Role.ADMIN, Role.EDITOR)
    @ApiOperation({ summary: 'Delete file (ADMIN, EDITOR)' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.filesService.remove(id);
    }
}

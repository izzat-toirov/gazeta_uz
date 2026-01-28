import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class FilesService {
    constructor(
        private prisma: PrismaService,
        private supabase: SupabaseService,
    ) { }

    async uploadSingle(file: Express.Multer.File) {
        const uploadResult = await this.supabase.uploadFile(file);

        return this.prisma.fileAsset.create({
            data: {
                originalName: file.originalname,
                filename: uploadResult.filename,
                path: uploadResult.path,
                url: uploadResult.url,
                mimetype: file.mimetype,
                size: file.size,
            },
        });
    }

    async uploadMultiple(files: Express.Multer.File[]) {
        return Promise.all(files.map((file) => this.uploadSingle(file)));
    }

    async findAll() {
        return this.prisma.fileAsset.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: number) {
        const file = await this.prisma.fileAsset.findUnique({ where: { id } });
        if (!file) throw new NotFoundException('File not found');
        return file;
    }

    async remove(id: number) {
        const file = await this.findOne(id);
        await this.supabase.deleteFile(file.path);
        return this.prisma.fileAsset.delete({ where: { id } });
    }
}

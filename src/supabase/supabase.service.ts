import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
    private supabase: SupabaseClient;

    constructor(private configService: ConfigService) {
        const supabaseUrl = this.configService.get<string>('SUPABASE_URL')!;
        const supabaseKey = this.configService.get<string>('SUPABASE_KEY')!;
        this.supabase = createClient(supabaseUrl, supabaseKey);
    }

    async uploadFile(file: Express.Multer.File, folder: string = 'media') {
        const bucket = this.configService.get<string>('SUPABASE_BUCKET') || 'JURNAL';
        const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
        const path = `${folder}/${filename}`;

        const { data, error } = await this.supabase.storage
            .from(bucket)
            .upload(path, file.buffer, {
                contentType: file.mimetype,
                upsert: false,
            });

        if (error) {
            console.error('Supabase upload error:', error);
            throw new InternalServerErrorException(`Supabase upload failed: ${error.message}`);
        }

        const { data: publicUrlData } = this.supabase.storage
            .from(bucket)
            .getPublicUrl(path);

        return {
            path: data.path,
            url: publicUrlData.publicUrl,
            filename,
        };
    }

    async deleteFile(path: string) {
        const bucket = this.configService.get<string>('SUPABASE_BUCKET') || 'JURNAL';
        const { error } = await this.supabase.storage.from(bucket).remove([path]);
        if (error) {
            console.error('Supabase delete error:', error);
            throw new InternalServerErrorException(`Supabase delete failed: ${error.message}`);
        }
    }
}

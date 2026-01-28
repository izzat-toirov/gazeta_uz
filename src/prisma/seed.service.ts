import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class SeedService implements OnModuleInit {
    private readonly logger = new Logger(SeedService.name);

    constructor(private prisma: PrismaService) { }

    async onModuleInit() {
        await this.seedSuperAdmin();
    }

    async seedSuperAdmin() {
        const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || 'admin@gazeta.uz';
        const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || 'admin123';
        const superAdminName = 'Super Admin';

        const existingSuperAdmin = await this.prisma.user.findFirst({
            where: { role: Role.SUPER_ADMIN },
        });

        if (!existingSuperAdmin) {
            this.logger.log('No Super Admin found. Creating default Super Admin...');

            const hashedPassword = await bcrypt.hash(superAdminPassword, 10);

            await this.prisma.user.create({
                data: {
                    email: superAdminEmail,
                    password: hashedPassword,
                    name: superAdminName,
                    role: Role.SUPER_ADMIN,
                },
            });

            this.logger.log(`Secondary Admin created! Email: ${superAdminEmail}`);
        } else {
            this.logger.log('Super Admin already exists.');
        }
    }
}

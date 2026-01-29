import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BotService {
    constructor(
        private prisma: PrismaService,
        private authService: AuthService,
    ) { }

    async validateUser(email: string, pass: string, telegramId: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (user && (await bcrypt.compare(pass, user.password))) {
            // Update telegramId
            await this.prisma.user.update({
                where: { id: user.id },
                data: { telegramId } as any,
            });
            return user;
        }
        return null;
    }

    async registerUser(email: string, pass: string, name: string, telegramId: string) {
        const existing = await this.prisma.user.findUnique({ where: { email } });
        if (existing) return null;

        const hashedPassword = await bcrypt.hash(pass, 10);
        const user = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                telegramId,
            } as any,
        });
        return user;
    }

    async getUserByTelegramId(telegramId: string) {
        return this.prisma.user.findUnique({ where: { telegramId } as any });
    }
}

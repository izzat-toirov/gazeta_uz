import { Update, Ctx, Start, Command, On } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { BotService } from './bot.service';
import { Markup } from 'telegraf';
import * as fs from 'fs';
import * as path from 'path';

enum BotStep {
    NONE = 'NONE',
    REGISTER_EMAIL = 'REGISTER_EMAIL',
    REGISTER_PASSWORD = 'REGISTER_PASSWORD',
    REGISTER_NAME = 'REGISTER_NAME',
    LOGIN_EMAIL = 'LOGIN_EMAIL',
    LOGIN_PASSWORD = 'LOGIN_PASSWORD',
}

interface UserSession {
    step: BotStep;
    data: {
        email?: string;
        password?: string;
        name?: string;
    };
}

@Update()
export class BotUpdate {
    private sessions = new Map<string, UserSession>();

    constructor(private readonly botService: BotService) { }

    private getSession(userId: string): UserSession {
        if (!this.sessions.has(userId)) {
            this.sessions.set(userId, { step: BotStep.NONE, data: {} });
        }
        return this.sessions.get(userId)!;
    }

    private clearSession(userId: string) {
        this.sessions.delete(userId);
    }

    @Start()
    async start(@Ctx() ctx: Context) {
        if (!ctx.from) return;
        this.clearSession(String(ctx.from.id));

        await ctx.reply(
            `Assalomu alaykum, ${ctx.from.first_name}!\n\n` +
            `Gazeta.uz botiga xush kelibsiz.`,
            Markup.keyboard([
                ['📥 So\'nggi jurnalni olish'],
                ['🔑 Kirish', '📝 Ro\'yxatdan o\'tish'],
                ['👤 Mening profilim']
            ]).resize()
        );
    }

    @On('text')
    async onText(@Ctx() ctx: Context) {
        if (!ctx.from || !ctx.message || !('text' in ctx.message)) return;
        const text = ctx.message.text;
        const userId = String(ctx.from.id);
        const session = this.getSession(userId);

        // Global Commands handling (resets state)
        if (text === '📥 So\'nggi jurnalni olish') {
            this.clearSession(userId);
            return this.getLatestJournal(ctx);
        } else if (text === '🔑 Kirish') {
            session.step = BotStep.LOGIN_EMAIL;
            session.data = {};
            await ctx.reply('Tizimga kirish uchun Emailingizni kiriting:', Markup.removeKeyboard());
            return;
        } else if (text === '📝 Ro\'yxatdan o\'tish') {
            session.step = BotStep.REGISTER_EMAIL;
            session.data = {};
            await ctx.reply('Ro\'yxatdan o\'tish uchun Emailingizni kiriting:', Markup.removeKeyboard());
            return;
        } else if (text === '👤 Mening profilim') {
            this.clearSession(userId);
            const user = await this.botService.getUserByTelegramId(userId);
            if (user) {
                await ctx.reply(`Sizning modelingiz:\nIsm: ${user.name}\nEmail: ${user.email}\nRol: ${user.role}`);
            } else {
                await ctx.reply('Siz tizimga kirmagansiz. Iltimos, "🔑 Kirish" yoki "📝 Ro\'yxatdan o\'tish" tugmasini bosing.');
            }
            return;
        }

        // State Machine Handling
        switch (session.step) {
            case BotStep.REGISTER_EMAIL:
                session.data.email = text;
                session.step = BotStep.REGISTER_PASSWORD;
                await ctx.reply('Yaxshi! Endi parolingizni kiriting:');
                break;
            case BotStep.REGISTER_PASSWORD:
                session.data.password = text;
                session.step = BotStep.REGISTER_NAME;
                await ctx.reply('Deyarli tugadi! Ismingizni kiriting:');
                break;
            case BotStep.REGISTER_NAME:
                session.data.name = text;
                // Register logic
                const regUser = await this.botService.registerUser(
                    session.data.email!,
                    session.data.password!,
                    session.data.name!,
                    userId
                );
                this.clearSession(userId);

                if (regUser) {
                    await ctx.reply(`Tabriklaymiz, ${regUser.name}! Siz muvaffaqiyatli ro'yxatdan o'tdingiz.`,
                        Markup.keyboard([
                            ['📥 So\'nggi jurnalni olish'],
                            ['👤 Mening profilim']
                        ]).resize()
                    );
                } else {
                    await ctx.reply('Ro\'yxatdan o\'tishda xatolik. Bu email allaqachon mavjud bo\'lishi mumkin.',
                        Markup.keyboard([
                            ['📥 So\'nggi jurnalni olish'],
                            ['🔑 Kirish', '📝 Ro\'yxatdan o\'tish']
                        ]).resize()
                    );
                }
                break;

            case BotStep.LOGIN_EMAIL:
                session.data.email = text;
                session.step = BotStep.LOGIN_PASSWORD;
                await ctx.reply('Parolingizni kiriting:');
                break;
            case BotStep.LOGIN_PASSWORD:
                session.data.password = text;
                // Login logic
                const loginUser = await this.botService.validateUser(
                    session.data.email!,
                    session.data.password!,
                    userId
                );
                this.clearSession(userId);

                if (loginUser) {
                    await ctx.reply(`Xush kelibsiz, ${loginUser.name}!`,
                        Markup.keyboard([
                            ['📥 So\'nggi jurnalni olish'],
                            ['👤 Mening profilim']
                        ]).resize()
                    );
                } else {
                    await ctx.reply('Email yoki parol noto\'g\'ri. Qaytadan urinib ko\'ring.',
                        Markup.keyboard([
                            ['📥 So\'nggi jurnalni olish'],
                            ['🔑 Kirish', '📝 Ro\'yxatdan o\'tish']
                        ]).resize()
                    );
                }
                break;

            default:
                break;
        }
    }

    @Command('login')
    async login(@Ctx() ctx: Context) {
        await ctx.reply('Iltimos, pastdagi "🔑 Kirish" tugmasidan foydalaning.');
    }

    @Command('register')
    async register(@Ctx() ctx: Context) {
        await ctx.reply('Iltimos, pastdagi "📝 Ro\'yxatdan o\'tish" tugmasidan foydalaning.');
    }

    @Command('get_latest_journal')
    async getLatestJournal(@Ctx() ctx: Context) {
        if (!ctx.from) return;
        const telegramId = String(ctx.from.id);
        const user = await this.botService.getUserByTelegramId(telegramId);

        if (!user) {
            return ctx.reply('Jurnalni olish uchun avval ro\'yxatdan o\'ting yoki kiring.');
        }

        const filePath = path.join(__dirname, '..', '..', 'journal_sample.pdf');

        // Generate a real PDF using PDFKit
        try {
            await new Promise<void>((resolve, reject) => {
                const PDFDocument = require('pdfkit');
                const doc = new PDFDocument();
                const stream = fs.createWriteStream(filePath);

                doc.pipe(stream);

                doc.fontSize(25).text('Gazeta.uz - So\'nggi Jurnal', 100, 100);
                doc.fontSize(14).text('Bu maxsus elektron jurnal namunasidir.', 100, 150);
                doc.text(`Foydalanuvchi: ${user.name}`, 100, 180);
                doc.text(`Sana: ${new Date().toLocaleDateString()}`, 100, 200);
                doc.text('-----------------------------------', 100, 220);
                doc.text('Gazeta.uz - Eng so\'nggi yangiliklar bizda.', 100, 240);

                doc.end();

                stream.on('finish', () => resolve());
                stream.on('error', (err) => reject(err));
            });
        } catch (e) {
            console.error('PDF Generation Error:', e);
            return ctx.reply('Tizim xatosi: PDF yaratishda muammo bo\'ldi.');
        }

        await ctx.reply('Jurnal yuklanmoqda... 📄');

        try {
            await ctx.replyWithDocument({ source: filePath, filename: 'gazeta_journal.pdf' });
        } catch (e) {
            console.error(e);
            await ctx.reply('Jurnalni yuborishda xatolik yuz berdi.');
        }
    }
}

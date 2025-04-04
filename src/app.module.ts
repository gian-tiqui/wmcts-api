import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config/dist';
import { DepartmentModule } from './department/department.module';
import { SecretQuestionModule } from './secret-question/secret-question.module';
import { TicketModule } from './ticket/ticket.module';
import { PriorityLevelModule } from './priority-level/priority-level.module';
import { CommentModule } from './comment/comment.module';
import { StatusModule } from './status/status.module';
import { NotificationModule } from './notification/notification.module';
import { CategoriesModule } from './categories/categories.module';
import { APP_GUARD } from '@nestjs/core';
import { RateLimiterGuard, RateLimiterModule } from 'nestjs-rate-limiter';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: 2525,
        secure: false,
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        },
      },
      defaults: {
        from: '"No Reply" <no-reply@meow.com>',
      },
      template: {
        dir: join(__dirname, '..', '..', 'src', 'template'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    AuthModule,
    UserModule,
    DepartmentModule,
    SecretQuestionModule,
    TicketModule,
    PriorityLevelModule,
    CommentModule,
    StatusModule,
    NotificationModule,
    CategoriesModule,
    RateLimiterModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RateLimiterGuard,
    },
  ],
  exports: [MailerModule],
})
export class AppModule {}

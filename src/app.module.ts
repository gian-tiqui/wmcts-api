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

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    ConfigModule.forRoot({ isGlobal: true }),
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
})
export class AppModule {}

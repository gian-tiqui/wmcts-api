import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config/dist';
import { DepartmentModule } from './department/department.module';
import { SecretQuestionModule } from './secret-question/secret-question.module';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

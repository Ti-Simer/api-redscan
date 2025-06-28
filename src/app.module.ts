import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { AuthModule } from './auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { UsersModule } from './users/users.module';
import { LocationsModule } from './locations/locations.module';
import { BarcodesModule } from './barcodes/barcodes.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60,
      limit: 15,
    }]),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: '123',
      database: 'redscan_montagas',
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Ruta a las entidades
      synchronize: true,
    }),
    UsersModule,
    RolesModule,
    PermissionsModule,
    AuthModule,
    LocationsModule,
    BarcodesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }


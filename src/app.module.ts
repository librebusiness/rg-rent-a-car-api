import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import "dotenv/config";
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './auth/jwt.guard';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { LocationsModule } from './locations/locations.module';
import { BookingsModule } from './bookings/bookings.module';
import { BusinessProfileModule } from './business-profile/business-profile.module';

const { MONGODB_URI } = process.env;

@Module({
  imports: [
    MongooseModule.forRoot(MONGODB_URI),
    UsersModule,
    AuthModule,
    VehiclesModule,
    LocationsModule,
    BookingsModule,
    BusinessProfileModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard
    },
  ],
})
export class AppModule {}

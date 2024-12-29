import { Module } from '@nestjs/common';
import { BusinessProfileService } from './business-profile.service';
import { BusinessProfileController } from './business-profile.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BusinessProfile, BusinessProfileSchema } from 'src/schemas/business-profile.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: BusinessProfile.name,
        schema: BusinessProfileSchema,
      }
    ])
  ],
  controllers: [BusinessProfileController],
  providers: [BusinessProfileService],
})
export class BusinessProfileModule {}

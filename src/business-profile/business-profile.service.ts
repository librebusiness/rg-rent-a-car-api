import { Injectable } from '@nestjs/common';
import { CreateBusinessProfileDto } from './dto/create-business-profile.dto';
import { UpdateBusinessProfileDto } from './dto/update-business-profile.dto';
import { InjectModel } from '@nestjs/mongoose';
import { BusinessProfile } from 'src/schemas/business-profile.schema';
import { Model } from 'mongoose';

@Injectable()
export class BusinessProfileService {

  constructor( @InjectModel(BusinessProfile.name) private businessProfileModel: Model<BusinessProfile> ) {}

  async create(createBusinessProfileDto: CreateBusinessProfileDto) {
    const profile = await this.businessProfileModel.create(createBusinessProfileDto);
    return profile.save();
  }

  findAll(filters?: any) {
    return this.businessProfileModel.find(filters).exec();
  }

  findOne(_id: string) {
    return this.businessProfileModel.findById(_id).exec();
  }

  update(_id: string, updateBusinessProfileDto: UpdateBusinessProfileDto) {
    return this.businessProfileModel.updateOne({ _id }, updateBusinessProfileDto).exec();
  }

  remove(_id: string) {
    return this.businessProfileModel.deleteOne({ _id }).exec();
  }
}

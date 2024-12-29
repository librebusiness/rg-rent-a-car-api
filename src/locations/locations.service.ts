import { Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Location } from 'src/schemas/location.schema';
import { Model } from 'mongoose';

@Injectable()
export class LocationsService {

  constructor(@InjectModel(Location.name) private locationModel: Model<Location>) {}

  async create(createLocationDto: CreateLocationDto) {
    const location = await this.locationModel.create(createLocationDto);
    return location.save();
  }

  findAll(filters?: any) {
    return this.locationModel.find(filters).exec();
  }

  findOne(_id: string) {
    return this.locationModel.findById(_id).exec();
  }

  update(_id: string, updateLocationDto: UpdateLocationDto) {
    return this.locationModel.updateOne({ _id }, updateLocationDto).exec();
  }

  remove(_id: string) {
    return this.locationModel.deleteOne({ _id }).exec();
  }
}

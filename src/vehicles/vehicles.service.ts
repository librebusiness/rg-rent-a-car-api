import { Injectable } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Vehicle } from 'src/schemas/vehicle.schema';
import { Model } from 'mongoose';

@Injectable()
export class VehiclesService {

  constructor(@InjectModel(Vehicle.name) private vehicleModel: Model<Vehicle>) {}

  async create(createVehicleDto: CreateVehicleDto) {
    const vehicle = await this.vehicleModel.create(createVehicleDto);
    return vehicle.save();
  }

  findAll(filters?: any) {
    return this.vehicleModel.find(filters).exec();
  }

  findOne(_id: string) {
    return this.vehicleModel.findById(_id).exec();
  }

  update(_id: string, updateVehicleDto: UpdateVehicleDto) {
    return this.vehicleModel.updateOne({ _id }, updateVehicleDto).exec();
  }

  remove(_id: string) {
    return this.vehicleModel.deleteOne({ _id }).exec();
  }
}

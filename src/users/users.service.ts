import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { genSalt, hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>
  ) {
  }

  async create(createUserDto: CreateUserDto) {
    const { password, ...userData } = createUserDto as any;
    if (!password)
      throw new HttpException('Missing password', HttpStatus.BAD_REQUEST);

    const user = new this.userModel(userData);
    const salt = await genSalt(10);
    user.passwordHash = await hash(password, salt);
    return user.save();
  }

  async findAll(filters?: any) {
    if (filters) {
      const users = await this.userModel.find(filters).exec();
      return users.map((user: any) => {
        const { passwordHash, __v, ...data } = user._doc;
        return data;
      })
    } else {
      const users = await this.userModel.find().exec();
      return users.map((user: any) => {
        const { passwordHash, __v, ...data } = user._doc;
        return data;
      })
    }
  }

  findOne(id: string) {
    return this.userModel.findById(id).exec();
  }

  findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  findBy(filters: any) {
    return this.userModel.findOne(filters).exec();
  }

  async update(_id: string, updateUserDto: UpdateUserDto) {
    const { password, ...data } = updateUserDto as any;
    if (password) {
      const salt = await genSalt(10);
      data.passwordHash = await hash(password, salt);
    }

    return this.userModel.updateOne({ _id }, data).exec();
  }

  remove(_id: string) {
    return this.userModel.deleteOne({ _id }).exec();
  }
}



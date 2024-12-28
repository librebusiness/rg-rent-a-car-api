import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({
    unique: true,
    required: true
  })
  email: string;

  @Prop()
  username: string;

  @Prop()
  passwordHash: string;

  @Prop()
  recoveryToken: string;

  @Prop()
  firstname: string;

  @Prop()
  lastname: string;

  @Prop()
  gender: string;

  @Prop()
  phone: string;

  @Prop()
  photoURL: string;

  @Prop()
  roles: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);



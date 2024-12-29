import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import * as mongoose from 'mongoose';
import { User } from "./user.schema";

export type BusinessProfileDocument = HydratedDocument<BusinessProfile>;

@Schema()
export class BusinessProfile {
    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: User;

    @Prop({ required: true })
    businessName: string;

    @Prop()
    slug: string;

    @Prop()
    description: string;

    @Prop()
    logo: string;

    @Prop()
    contactNumber: string;

    @Prop()
    email: string;

    @Prop()
    address: string;

    @Prop()
    country: string;

    @Prop()
    state: string;

    @Prop()
    city: string;

    @Prop()
    services: string[];

    @Prop({ default: false })
    primary: boolean;
}

export const BusinessProfileSchema = SchemaFactory.createForClass(BusinessProfile);

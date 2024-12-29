import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import * as mongoose from 'mongoose';

export type LocationDocument = HydratedDocument<Location>;

@Schema()
export class Schedule {
    @Prop({ required: true })
    day: string;

    @Prop({ required: true })
    openingTime: string;

    @Prop({ required: true })
    closingTime: string;
}

@Schema({ timestamps: true })
export class Location {
    @Prop()
    name: string;

    @Prop()
    country: string;

    @Prop()
    state: string;

    @Prop()
    city: string;

    @Prop()
    address: string;

    @Prop()
    manager: string;

    @Prop()
    phone: string;

    @Prop()
    schedule: Schedule[];

    @Prop()
    description: string;

    @Prop()
    status: string;

    @Prop()
    geolocation: string;

    @Prop()
    primary: boolean;
}

export const LocationSchema = SchemaFactory.createForClass(Location);

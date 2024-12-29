import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import * as mongoose from 'mongoose';
import { Location } from './location.schema';
import { BusinessProfile } from "./business-profile.schema";

export type VehicleDocument = HydratedDocument<Vehicle>;

@Schema({ timestamps: true })
export class Vehicle {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'BusinessProfile', required: true })
    business: BusinessProfile;

    @Prop()
    make: string;

    @Prop({ default: 'car' })
    category: string;

    @Prop({ default: 'sedan' })
    vehicleType: string;

    @Prop()
    model: string;

    @Prop()
    year: number;

    @Prop()
    color: string;

    @Prop()
    licensePlate: string;

    @Prop()
    vin: string;

    @Prop()
    mileage: number;

    @Prop()
    pricePerDay: number;

    @Prop()
    status: string;

    @Prop()
    fuelType: string;

    @Prop()
    transmissionType: string;

    @Prop()
    seatingCapacity: number;

    @Prop()
    features: string[];

    @Prop()
    imageUrl: string;

    @Prop()
    description: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Location' })
    location: Location;

    // maintenancehistory
    @Prop()
    insuranceStatus: string;

    @Prop()
    insuranceCompany: string;
    
    @Prop()
    insuranceEndDate: Date;

    @Prop()
    remarks: string;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);

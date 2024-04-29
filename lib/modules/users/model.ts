import * as mongoose from 'mongoose';

export interface IUser {
    _id?: mongoose.Types.ObjectId;
    first_name:string;
    middle_name?:string;
    last_name:string;
    email: string;
    phone_number: string;
    gender: string;
    places?: mongoose.Types.ObjectId[]; // Array to store place IDs
    reviews?: mongoose.Types.ObjectId[]; // Array to store review IDs
    conversations?:mongoose.Types.ObjectId[];
    user_rating?:number;
    photo?:string;
    description?:string;
    dni?:string;
    personality?:string;
    password: string;
    birth_date: Date;
    role: string;
    address?:string;
    housing_offered?:mongoose.Types.ObjectId[];
    emergency_contact?: {
        full_name: string;
        telephone: string;
    };
    user_deactivated:boolean;
    creation_date: Date;
    modified_date: Date;
    encryptPassword(password: string): Promise<string>;
    validatePassword(password: string): Promise<boolean>;
}
export interface IUserModel extends IUser, Document {}
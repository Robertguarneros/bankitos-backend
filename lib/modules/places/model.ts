import * as mongoose from 'mongoose';

export interface IPlace {
    _id?: mongoose.Types.ObjectId; // Optional _id field
    title: string;
    content: string;
    author: mongoose.Types.ObjectId; // Reference to the User collection
    reviews?: mongoose.Types.ObjectId[];
    rating: number;
    coords: ICoords;
    photo: string;
    typeOfPlace: {
        bankito: boolean;
        public: boolean; //false = private true = public
        covered: boolean;
    };
    schedule: {
        monday: String;
        tuesday: String;
        wednesday: String;
        thursday: String;
        friday: String;
        saturday: String;
        sunday: String;
    };
    address: string;
    place_deactivated:boolean;
    creation_date: Date;
    modified_date: Date;
}

interface ICoords {
    type: 'Point';
    coordinates: [number,number]
}
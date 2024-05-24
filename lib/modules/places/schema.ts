import * as mongoose from "mongoose";
import { IPlace } from "./model";

const Schema = mongoose.Schema;

const schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "users", required: true }, // Reference to the User model
  reviews: [{ type: Schema.Types.ObjectId, ref: "reviews", required:false }],
  rating: { type: Number, required: true },
  coords: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }
  },
  photo: { type: String, required: true },
  typeOfPlace: {
    type: {
    bankito: { type: Boolean, required: true },
    public: { type: Boolean, required: true },
    covered: { type: Boolean, required: true }},
    required: true,
  },
  schedule: {
    type:{
    monday: { type: String, required: true },
    tuesday: { type: String, required: true },
    wednesday: { type: String, required: true },
    thursday: { type: String, required: true },
    friday: { type: String, required: true },
    saturday: { type: String, required: true },
    sunday: { type: String, required: true }},
    required: true
  },
  address: { type: String, required: true },
  place_deactivated: {type:Boolean,required:true,default:false},
  creation_date: {type:Date,required:true,default:new Date()},
  modified_date: {type:Date,required:true,default: new Date()}

});

schema.index({ coords: '2dsphere' });

export default mongoose.model<IPlace>('place', schema);

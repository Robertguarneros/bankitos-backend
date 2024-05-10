import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

const schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'reviews' }],
    rating: { type: Number, required: true },
    coords: {
        type:{
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }},
        required: true,
      },
    photo: { type: String, required: true },
    address: { type: String, required: true },
    availability: { type: Boolean, required: true },
    coffee: { type: Boolean, required: true },
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
    verified: { type: Boolean, required: true },
    house_deactivated: {type:Boolean,required:true,default:false},
    creation_date: {type:Date,required:true,default:new Date()},
    modified_date: {type:Date,required:true,default: new Date()}

});

export default mongoose.model("housings", schema);

import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const imageSchema = new Schema({
    data: { type: String, required: false },
    type: { type: String, required: false }
},
    {
        timestamps: true
    });

const Image = model('Image', imageSchema)
export default Image
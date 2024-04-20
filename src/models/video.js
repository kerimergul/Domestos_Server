import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const videoSchema = new Schema({
    data: { type: String, required: true },
    active: { type: Boolean, required: true, default: true },
    no: { type: Number, required: true },
},
    {
        timestamps: true
    });

const Video = model('Video', videoSchema)
export default Video
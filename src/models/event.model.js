import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  themeName: { type: String, required: true },
  date: { type: Date, required: true },
  venue: { type: String, required: true },
  duration: { type: String, required: true },
  // description: [{ type: String }],
  description: { type: String},
  images: [{ type: String }],
  videos: [{ type: String }],
  feedback: {
    type: { type: String },
    video: { type: String },
    audio: { type: String },
    text: { type: String }
  }
});


const Event= mongoose.model('Event', eventSchema);

export default Event;

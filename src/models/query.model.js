import mongoose, { Schema } from "mongoose";
import { AvailableContactSubjects } from "../constants.js";

const userQuerySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
      index: true,
    },
    location: {
      type: String,
      trim: true,
    },
    subject: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      match: [/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/, "Please provide a valid email"],
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: Number,
      match: [/^\+?(\d{1,4})?[\s(-]?\(?(\d{3})\)?[-\s]?(\d{3})[-\s]?(\d{4})$/, "Please provide a valid phoneNumber"],
      // required: [true, "Please provide a phoneNumber"],
    },

    // phoneNumber: {
    //   type: String, 
    //   required: [true, "Please provide a phone number"],
    //   validate: {
    //     validator: function (value) {
    //      
    //       return /^\+?(\d{1,4})?[\s(-]?\(?(\d{3})\)?[-\s]?(\d{3})[-\s]?(\d{4})$/.test(value);
    //     },
    //     message: "Please provide a valid phone number",
    //   },
    //   trim: true,
    // },


    // contactNumber: {
    //   countryCode: {
    //     type: String,
    //     trim: true,
    //     required: [true, 'Country code is required'],
    //   },
    //   number: {
    //     type: String,
    //     trim: true,
    //     required: [true, 'Phone number is required'],
    //     match: [/^\+?(\d{1,4})?[\s(-]?\(?(\d{3})\)?[-\s]?(\d{3})[-\s]?(\d{4})$/, "Please provide a valid phoneNumber"],
    //   },
    // },
   
    



    message: {
      type: String,
      required: [true, "Please provide a message"],
      lowercase: true,
      trim: true,
    },
    link: {
      type: String,
      lowercase: true,
      trim: true,
    },
    organization: {
      type: String,
      lowercase: true,
      trim: true,
    },
    intrestedIn: {
      type: String,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Query = mongoose.model("Query", userQuerySchema);

export default Query;

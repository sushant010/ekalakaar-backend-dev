import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import ArtistProfile from "./Artist/profile.model.js";
import PatronProfile from "./Patron/profile.model.js";

import { AvailableUserRolesEnum } from "../constants.js";
import Application from "./application.model.js";
import Opportunity from "./opportunity.model.js";

const userSchema = new Schema(
  {
    avatar: {
      type: {
        url: String,
        localPath: String,
      },
      default: {
        url: `https://via.placeholder.com/200x200.png`,
        localPath: "",
      },
      _id: false,
    },
    appliedOpportunities: [
      {
        type: Schema.Types.ObjectId,
        ref: "Opportunity",
      },
    ],
    address: {
      state: {
        type: String,
        trim: true,
        default: "",
      },
      city: {
        type: String,
        trim: true,
        default: "",
      },
      pincode: {
        type: Number,
        default: "",
      },
    },
    contactDetails: {
      email: {
        type: String,
        trim: true,
        default: "",
      },
      contactNumber: {
        type: String,
        trim: true,
        default: "",
      },
      website: {
        type: String,
        trim: true,
        default: "",
      },
      expectations: {
        type: String,
        trim: true,
        default: "",
      },
    },
    socialLinks: {
      instagram: {
        type: String,
        trim: true,
        default: "",
      },
      facebook: {
        type: String,
        trim: true,
        default: "",
      },
      linkedIn: {
        type: String,
        trim: true,
        default: "",
      },
      youtube: {
        type: String,
        trim: true,
        default: "",
      },
      twitter: {
        type: String,
        trim: true,
        default: "",
      },
      website: {
        type: String,
        trim: true,
        default: "",
      },
    },
    firstName: {
      type: String,
      trim: true,
      required: [true, "Please provide a firstName"],
      index: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, "Please provide a lastName"],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Please provide an email"],
      match: [/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/, "Please provide a valid email"],
      unique: [true, "Provided email address is already in use"],
      lowercase: true,
    },
    role: {
      type: String,
      trim: true,
      enum: {
        values: AvailableUserRolesEnum,
        message: "Please provide a valid role",
      },
      required: [true, "Please provide a role"],
    },
    phoneNumber: {
      countryCode: {
        type: String,
        trim: true,
      },
      number: {
        type: String,
        trim: true,
        match: [/^\+?(\d{1,4})?[\s(-]?\(?(\d{3})\)?[-\s]?(\d{3})[-\s]?(\d{4})$/, "Please provide a valid phoneNumber"],
        required: [true, "Please provide a phoneNumber"],
      },
    },
    password: {
      type: String,
      trim: true,
      select: false,
      required: [true, "Please provide password"],
    },
    passwordConfirm: {
      type: String,
      trim: true,
      // required: [true, "Please provide passwordConfirm"],
      validate: {
        validator: function (passwordConfirm) {
          // return passwordConfirm === this.password;
          return !this.password || passwordConfirm === this.password;
        },
        message: "Passwords are not the same",
      },
    },
    refreshToken: {
      type: String,
      select: false,
    },
    passwordChangedAt: Date,
    passwordResetToken: { type: String, trim: true },
    passwordResetExpires: Date,
    savedOpportunities: [
      {
        type: Schema.Types.ObjectId,
        ref: "Opportunity",
      },
    ],
    isVerified: {
      type: Boolean,
       default: false,
    },
    customID: {
      type: String,
      // unique: true, 
      required: true
    },
    profileCompleted: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
   },
   isAproved: {
    type: Boolean,
    default: true,
   },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  user.role === "Artist" && delete userObject.contactDetails;

  return userObject;
};

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  this.passwordConfirm = undefined;

  if (this.role === "Artist") {
    this.contactDetails = undefined;
    await ArtistProfile.create({ _id: this._id });
  }

  if (this.role === "Patron") {
    this.appliedOpportunities = undefined;
    this.savedOpportunities = undefined;
    await PatronProfile.create({ _id: this._id });
  }

  next();
});

userSchema.methods.deleteUser = async function (id) {
  const user = await this.model("User").findByIdAndDelete(id).select("role");

  if (user.role === "Artist") {
    await Application.deleteMany({ appliedBy: user._id });
    await ArtistProfile.findOneAndDelete({ _id: user._id });
  }
  if (user.role === "Patron") {
    await PatronProfile.findOneAndDelete({ userId: user._id });
    await Opportunity.deleteMany({ userId: user._id });
  }

  return user;
};

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

const User = mongoose.model("User", userSchema);

export default User;

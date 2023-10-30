import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleSaveError, runValidatorsAtUpdate } from "./hooks.js";

const subscriptionList = ["starter", "pro", "business"];
const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;


const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "User name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: emailRegexp,
      unique: true,
    },
    password: {
      type: String,
      minlength: 6,
      required: [true, "Set password for user"],
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
  },
    subscription: {
      type: String,
      enum: subscriptionList,
      default: "starter",
    },
    token: String,
    avatarURL: String,
  },
  
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleSaveError);

userSchema.pre("findOneAndUpdate", runValidatorsAtUpdate);

userSchema.post("findOneAndUpdate", handleSaveError);

export const userSignupSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
  subscription: Joi.string().valid(...subscriptionList),
});

export const userSigninSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
  subscription: Joi.string().valid(...subscriptionList),
});

export const userEmailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
 
});

export const userUpdateSubscriptionSchema = Joi.object({
  subscription: Joi.string().valid(...subscriptionList),
});

const User = model("user", userSchema);

export default User;
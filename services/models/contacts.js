import { Schema, model } from "mongoose";

const contactSchema = new Schema(
  {
    name: {
      type: String,
      minLength: 3,
      maxLength: 20,
      trim: true,
      required: [true, "the 'name' fileds is required"],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "the 'email' filed is required"],
    },
    phone: {
      type: String,
      minLength: 3,
      maxLength: 16,
      trim: true,
      required: [true, "The 'phone' field is required"],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Contact = model("Contact", contactSchema);

export default Contact;

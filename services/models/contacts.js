import { Schema, model } from "mongoose";

const contactSchema = new Schema(
  {
    name: {
      type: String,
      minlength: 3,
      maxlength: 20,
      trim: true,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Email is required"],
    },
    phone: {
      type: String,
      minlength: 3,
      maxlength: 16,
      trim: true,
      required: [true, "Phone is required"],
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

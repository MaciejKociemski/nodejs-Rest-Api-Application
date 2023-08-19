import { Schema, model } from "mongoose";

const contact = new Schema(
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
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Contact = model("Contact", contactSchema);

export default Contact;

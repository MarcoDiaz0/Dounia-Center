import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Parent is required"],
    },
    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
      required: [true, "Program is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required for reservation"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "rejected"],
      default: "pending",
    },
    time: {
      type: String,
      default: "",
    },
    where: {
      type: String,
      default: "",
    },
    message: {
      type: String,
      default: "",
    },
    adminNotes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

sessionSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Session = mongoose.model("Session", sessionSchema);
export default Session;

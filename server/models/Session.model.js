import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    child: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Child",
      required: [true, "Child reference is required"],
    },
    date: {
      type: Date,
      required: [true, "Session date is required"],
    },
    time: {
      type: String,
      required: [true, "Session time is required"],
    },
    type: {
      type: String,
      enum: ["therapy", "learning"],
      required: [true, "Session type is required"],
    },
    status: {
      type: String,
      enum: ["completed", "upcoming", "cancelled"],
      default: "upcoming",
    },
  },
  { timestamps: true },
);

sessionSchema.index({ child: 1 });
sessionSchema.index({ date: 1 });

sessionSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Session = mongoose.model("Session", sessionSchema);
export default Session;

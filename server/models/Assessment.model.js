import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema(
  {
    child: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Child",
      required: [true, "Child reference is required"],
    },
    date: {
      type: Date,
      required: [true, "Assessment date is required"],
    },
    type: {
      type: String,
      enum: ["initial", "follow-up"],
      required: [true, "Assessment type is required"],
    },
    results: {
      attention: { type: Number, min: 0, max: 100 },
      reading: { type: Number, min: 0, max: 100 },
      behavior: { type: Number, min: 0, max: 100 },
      writing: { type: Number, min: 0, max: 100 },
    },
  },
  { timestamps: true },
);

assessmentSchema.index({ child: 1 });

assessmentSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Assessment = mongoose.model("Assessment", assessmentSchema);
export default Assessment;

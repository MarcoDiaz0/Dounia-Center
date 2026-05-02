import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    child: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Child",
      required: [true, "Child reference is required"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    content: {
      type: String,
      required: [true, "Note content is required"],
      trim: true,
    },
  },
  { timestamps: true },
);

noteSchema.index({ child: 1 });

noteSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Note = mongoose.model("Note", noteSchema);
export default Note;

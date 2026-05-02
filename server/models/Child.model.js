import mongoose from "mongoose";

// ─────────────────────────────────────────
// Sub-schemas
// ─────────────────────────────────────────

const milestoneSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ["cognitive", "motor", "language", "social"],
      required: true,
    },
    achievedAt: { type: Date, default: Date.now },
    notes: String,
  },
  { _id: true },
);

const developmentalScoreSchema = new mongoose.Schema(
  {
    cognitive: { type: Number, min: 0, max: 100, default: 0 },
    motor: { type: Number, min: 0, max: 100, default: 0 },
    language: { type: Number, min: 0, max: 100, default: 0 },
    socialEmotional: { type: Number, min: 0, max: 100, default: 0 },
  },
  { _id: false },
);

// ─────────────────────────────────────────
// Child Schema
// ─────────────────────────────────────────

const childSchema = new mongoose.Schema(
  {
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Parent reference is required"],
    },
    firstName: {
      type: String,
      required: [true, "Child first name is required"],
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Child last name is required"],
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Date of birth is required"],
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: [true, "Gender is required"],
    },
    avatar: {
      type: String,
      default: null,
    },
    developmentalScores: {
      type: developmentalScoreSchema,
      default: () => ({}),
    },
    milestones: [milestoneSchema],

    // ── New References ──────────────────
    enrolledPrograms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Program",
      },
    ],
    assessments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assessment",
      },
    ],
    sessions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
      },
    ],
    notes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Note",
      },
    ],
    // ────────────────────────────────────

    specialNeeds: [{ type: String, trim: true }],
    allergies: [{ type: String, trim: true }],
    medicalNotes: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// ─────────────────────────────────────────
// Indexes
// ─────────────────────────────────────────

childSchema.index({ parent: 1 });
childSchema.index({ dateOfBirth: 1 });

// ─────────────────────────────────────────
// Virtuals
// ─────────────────────────────────────────

childSchema.virtual("age").get(function () {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  if (months < 0) {
    years--;
    months += 12;
  }
  return { years, months };
});

childSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// ─────────────────────────────────────────
// Output Transform
// ─────────────────────────────────────────

childSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Child = mongoose.model("Child", childSchema);
export default Child;

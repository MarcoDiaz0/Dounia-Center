import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: [80, "Full name cannot exceed 80 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    role: {
      type: String,
      enum: ["parent", "admin"],
      default: "parent",
    },

    avatar: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    preferences: {
      language: {
        type: String,
        enum: ["ar", "en"],
        default: "ar",
      },
      notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
      },
    },
  },
  {
    timestamps: true,
  },
);

/* index */
userSchema.index({ role: 1 });

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;

  const isBcryptHash =
    this.password.startsWith("$2a$") ||
    this.password.startsWith("$2b$") ||
    this.password.startsWith("$2y$");

  if (!isBcryptHash) {
    return candidatePassword === this.password;
  }

  return bcrypt.compare(candidatePassword, this.password);
};

/* clean output */
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    return ret;
  },
});

const User = mongoose.model("User", userSchema);

export default User;

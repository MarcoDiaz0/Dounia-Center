import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
      required: [true, "Program is required"],
    },
    paymentMethod: {
      type: String,
      enum: ["ccp", "baridimob", "redotpay"],
      required: [true, "Payment method is required"],
    },
    transactionNumber: {
      type: String,
      required: [true, "Transaction number is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

subscriptionSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;

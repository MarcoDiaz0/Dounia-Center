/**
 * Seed Script — creates an admin and a parent user in MongoDB.
 *
 * Usage:
 *   node server/seed.js
 *
 * Requires the server's .env to be present (or MONGODB_URI env var set).
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "..", ".env") });

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/dounia_center";

// ─── Minimal User Schema (avoid importing app models) ────────────────────────
const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String, default: "" },
    role: { type: String, enum: ["parent", "admin"], default: "parent" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

const users = [
  {
    fullName: "مدير النظام",
    email: "admin@dounia.com",
    password: "admin123",
    role: "admin",
    phone: "0500000000",
  },
  {
    fullName: "ولي أمر تجريبي",
    email: "parent@dounia.com",
    password: "parent123",
    role: "parent",
    phone: "0511111111",
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    for (const userData of users) {
      const existing = await User.findOne({ email: userData.email });
      if (existing) {
        console.log(`⚠️  User already exists: ${userData.email} — skipping`);
        continue;
      }
      await User.create(userData);
      console.log(
        `✅ Created ${userData.role}: ${userData.email} / ${userData.password}`
      );
    }

    console.log("\n🎉 Seeding complete!\n");
    console.log("  Admin   → admin@dounia.com   / admin123");
    console.log("  Parent  → parent@dounia.com  / parent123");
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB.");
  }
}

seed();

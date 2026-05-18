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

const programs = [
  {
    name: "الدعم النفسي والإرشاد",
    description: "جلسات تربوية وإرشادية فردية وجماعية",
    category: "general",
    price: "3,500",
    duration: "جلسة 45 دقيقة",
    icon: "Heart",
    features: [
      "جلسات فردية إرشادية",
      "جلسات جماعية تفاعلية",
      "إرشاد أسري للأهل",
      "متابعة مستمرة",
    ],
    longDescription:
      "نقدم جلسات دعم تربوي شاملة للأطفال والمراهقين، تشمل الإرشاد السلوكي، والتعلم باللعب، وجلسات الإرشاد الأسري. نركز في مركزنا على فهم احتياجات كل طفل وتقديم الدعم المناسب.",
  },
  {
    name: "برنامج صعوبات التعلم",
    description: "برنامج شامل لعلاج صعوبات التعلم مثل عسر القراءة والحساب",
    category: "reading",
    price: "15,000",
    duration: "برنامج شهري",
    icon: "Brain",
    features: [
      "تقييم شامل لصعوبات التعلم",
      "خطة علاجية فردية",
      "تمارين تفاعلية",
      "تقارير تقدم دورية",
    ],
    longDescription:
      "برنامج شامل يعالج مختلف صعوبات التعلم بما في ذلك عسر القراءة (Dyslexia)، عسر الكتابة (Dysgraphia)، وعسر الحساب (Dyscalculia). يتضمن البرنامج تقييماً شاملاً وخطة علاجية مخصصة.",
  },
  {
    name: "تحسين القراءة والكتابة",
    description: "تدريب مكثف لتطوير مهارات القراءة والكتابة",
    category: "reading",
    price: "12,000",
    duration: "برنامج شهري",
    icon: "BookOpen",
    features: [
      "تدريبات الوعي الصوتي",
      "تمارين فهم القراءة",
      "الكتابة الإبداعية",
      "تحسين الإملاء",
    ],
    longDescription:
      "برنامج متكامل لتحسين مهارات القراءة والكتابة عند الأطفال. يشمل تدريبات على الوعي الصوتي، فهم القراءة، الكتابة الإبداعية، والإملاء.",
  },
  {
    name: "توجيه الأولياء",
    description: "ورشات وجلسات إرشادية للأهل لدعم أطفالهم",
    category: "general",
    price: "2,500",
    duration: "جلسة 60 دقيقة",
    icon: "Users",
    features: ["ورشات تربوية", "استشارات فردية", "مجموعات دعم الأهل", "موارد تعليمية"],
    longDescription:
      "جلسات وورشات تربوية للأهل لمساعدتهم على فهم احتياجات أطفالهم وكيفية دعمهم بشكل فعال في المنزل والمدرسة.",
  },
];

const User = mongoose.models.User || mongoose.model("User", userSchema);
const Program =
  mongoose.models.Program ||
  mongoose.model(
    "Program",
    new mongoose.Schema({
      name: String,
      description: String,
      category: String,
      price: String,
      duration: String,
      icon: String,
      features: [String],
      longDescription: String,
      isActive: { type: Boolean, default: true },
    })
  );

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

    for (const progData of programs) {
      const existing = await Program.findOne({ name: progData.name });
      if (existing) {
        console.log(`⚠️  Program already exists: ${progData.name} — skipping`);
        continue;
      }
      await Program.create(progData);
      console.log(`✅ Created Program: ${progData.name}`);
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

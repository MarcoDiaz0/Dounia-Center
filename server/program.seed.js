import Program from "./models/Program.model.js";

const bacProgramSeed = {
  systemKey: "bac_support",
  name: "دعم تلاميذ الباكالوريا",
  description: "برنامج دعم نفسي وأكاديمي شامل لتلاميذ البكالوريا",
  category: "general",
  price: "20,000",
  duration: "برنامج شامل",
  icon: "GraduationCap",
  features: [
    "جلسات دعم نفسي للتعامل مع القلق",
    "تقنيات إدارة الضغط",
    "استراتيجيات الدراسة الفعالة",
    "التحضير للامتحانات",
    "توجيه مهني وجامعي",
  ],
  longDescription:
    "برنامج دعم نفسي وأكاديمي شامل لتلاميذ البكالوريا. نساعدهم على التغلب على الضغط والقلق، وتحسين مهارات الدراسة والتحضير للامتحانات.",
  isActive: true,
};

export const ensureSeedPrograms = async () => {
  await Program.findOneAndUpdate(
    { systemKey: bacProgramSeed.systemKey },
    { $set: bacProgramSeed },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    },
  );
};

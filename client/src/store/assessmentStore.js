import { create } from "zustand";

const assessmentQuestions = [
  {
    id: 1,
    category: "attention",
    question: "هل يواجه طفلك صعوبة في التركيز على مهمة واحدة لفترة طويلة؟",
    options: [
      { value: 0, label: "نادرًا" },
      { value: 1, label: "أحيانًا" },
      { value: 2, label: "غالبًا" },
      { value: 3, label: "دائمًا" },
    ],
  },
  {
    id: 2,
    category: "attention",
    question: "هل ينسى طفلك التعليمات التي أعطيت له بسهولة؟",
    options: [
      { value: 0, label: "نادرًا" },
      { value: 1, label: "أحيانًا" },
      { value: 2, label: "غالبًا" },
      { value: 3, label: "دائمًا" },
    ],
  },
  {
    id: 3,
    category: "reading",
    question: "هل يخلط طفلك بين الحروف المتشابهة عند القراءة؟",
    options: [
      { value: 0, label: "نادرًا" },
      { value: 1, label: "أحيانًا" },
      { value: 2, label: "غالبًا" },
      { value: 3, label: "دائمًا" },
    ],
  },
  {
    id: 4,
    category: "reading",
    question: "هل يعاني طفلك من صعوبة في فهم ما يقرأه؟",
    options: [
      { value: 0, label: "نادرًا" },
      { value: 1, label: "أحيانًا" },
      { value: 2, label: "غالبًا" },
      { value: 3, label: "دائمًا" },
    ],
  },
  {
    id: 5,
    category: "behavior",
    question: "هل يجد طفلك صعوبة في التحكم بانفعالاته؟",
    options: [
      { value: 0, label: "نادرًا" },
      { value: 1, label: "أحيانًا" },
      { value: 2, label: "غالبًا" },
      { value: 3, label: "دائمًا" },
    ],
  },
  {
    id: 6,
    category: "behavior",
    question: "هل يتجنب طفلك التفاعل مع الأطفال الآخرين؟",
    options: [
      { value: 0, label: "نادرًا" },
      { value: 1, label: "أحيانًا" },
      { value: 2, label: "غالبًا" },
      { value: 3, label: "دائمًا" },
    ],
  },
  {
    id: 7,
    category: "writing",
    question: "هل تبدو كتابة طفلك غير منظمة أو صعبة القراءة؟",
    options: [
      { value: 0, label: "نادرًا" },
      { value: 1, label: "أحيانًا" },
      { value: 2, label: "غالبًا" },
      { value: 3, label: "دائمًا" },
    ],
  },
  {
    id: 8,
    category: "writing",
    question: "هل يرتكب طفلك أخطاء إملائية متكررة؟",
    options: [
      { value: 0, label: "نادرًا" },
      { value: 1, label: "أحيانًا" },
      { value: 2, label: "غالبًا" },
      { value: 3, label: "دائمًا" },
    ],
  },
];

export const useAssessmentStore = create((set, get) => ({
  questions: assessmentQuestions,
  currentStep: 0,
  answers: {},
  isComplete: false,
  result: null,

  setAnswer: (questionId, value) => {
    set((state) => ({
      answers: {
        ...state.answers,
        [questionId]: value,
      },
    }));
  },

  nextStep: () => {
    const { currentStep, questions } = get();
    if (currentStep < questions.length - 1) {
      set({ currentStep: currentStep + 1 });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 0) {
      set({ currentStep: currentStep - 1 });
    }
  },

  goToStep: (step) => {
    set({ currentStep: step });
  },

  calculateResult: () => {
    const { answers, questions } = get();

    const categories = {
      attention: { score: 0, max: 0 },
      reading: { score: 0, max: 0 },
      behavior: { score: 0, max: 0 },
      writing: { score: 0, max: 0 },
    };

    questions.forEach((q) => {
      categories[q.category].max += 3;
      if (answers[q.id] !== undefined) {
        categories[q.category].score += answers[q.id];
      }
    });

    const recommendations = [];

    if (categories.attention.score >= 3) {
      recommendations.push({
        area: "التركيز والانتباه",
        description: "قد يحتاج طفلك إلى دعم في مجال التركيز والانتباه",
        program: "برنامج تحسين التركيز",
      });
    }

    if (categories.reading.score >= 3) {
      recommendations.push({
        area: "القراءة",
        description: "قد يستفيد طفلك من برنامج تحسين مهارات القراءة",
        program: "برنامج صعوبات التعلم",
      });
    }

    if (categories.behavior.score >= 3) {
      recommendations.push({
        area: "السلوك والتفاعل",
        description: "قد يحتاج طفلك إلى دعم نفسي وسلوكي",
        program: "الدعم النفسي والإرشاد",
      });
    }

    if (categories.writing.score >= 3) {
      recommendations.push({
        area: "الكتابة",
        description: "قد يحتاج طفلك إلى تدريب على مهارات الكتابة",
        program: "برنامج تحسين الكتابة",
      });
    }

    const result = {
      categories,
      recommendations,
      overallMessage:
        recommendations.length > 0
          ? "بناءً على إجاباتك، نوصي بالتواصل معنا للحصول على تقييم شامل."
          : "يبدو أن طفلك يتطور بشكل طبيعي. استمروا في المتابعة والدعم!",
    };

    set({ result, isComplete: true });
    return result;
  },

  resetAssessment: () => {
    set({
      currentStep: 0,
      answers: {},
      isComplete: false,
      result: null,
    });
  },
}));

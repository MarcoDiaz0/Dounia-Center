import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ClipboardCheck,
  ArrowLeft,
  ArrowRight,
  RefreshCcw,
  CheckCircle,
  AlertCircle,
  Brain,
  BookOpen,
  Heart,
  Edit3,
} from "lucide-react";
import Button from "@/components/common/Button";
import Card, { CardContent } from "@/components/common/Card";
import { useAssessmentStore } from "@/store/assessmentStore";
import { useAuthStore } from "@/store/authStore";
import { useChildStore } from "../store/childStore";

const categoryInfo = {
  attention: {
    icon: Brain,
    label: "التركيز والانتباه",
    color: "bg-purple-100 text-purple-600",
  },
  reading: {
    icon: BookOpen,
    label: "القراءة",
    color: "bg-blue-100 text-blue-600",
  },
  behavior: {
    icon: Heart,
    label: "السلوك",
    color: "bg-rose-100 text-rose-600",
  },
  writing: {
    icon: Edit3,
    label: "الكتابة",
    color: "bg-amber-100 text-amber-600",
  },
};

export default function Assessment() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const {
    questions,
    currentStep,
    answers,
    isComplete,
    result,
    setAnswer,
    nextStep,
    prevStep,
    calculateResult,
    resetAssessment,
  } = useAssessmentStore();

  const { createChild, addAssessment, isLoading } = useChildStore();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "male",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const child = await createChild(form);
      if (result) {
        const toPercent = (score, max) => Math.round(((max - score) / max) * 100);

        await addAssessment(child._id, {
          type: "initial",
          date: new Date().toISOString().split("T")[0],
          results: {
            attention: toPercent(
              result.categories.attention.score,
              result.categories.attention.max,
            ),
            reading: toPercent(
              result.categories.reading.score,
              result.categories.reading.max,
            ),
            behavior: toPercent(
              result.categories.behavior.score,
              result.categories.behavior.max,
            ),
            writing: toPercent(
              result.categories.writing.score,
              result.categories.writing.max,
            ),
          },
        });
      }
      toast.success("تم إنشاء ملف الطفل وحفظ النتائج بنجاح");
      resetAssessment();
      navigate("/dashboard");
    } catch (err) {
      toast.error("فشل حفظ ملف الطفل");
      console.error(err);
    }
  };
  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;
  const canGoNext = answers[currentQuestion?.id] !== undefined;

  const handleNext = () => {
    if (currentStep === questions.length - 1) {
      calculateResult();
    } else {
      nextStep();
    }
  };

  const handleStartOver = () => {
    resetAssessment();
  };

  // Intro Screen
  if (!currentQuestion && !isComplete) {
    return (
      <div className="min-h-screen bg-cream py-20">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-primary-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <ClipboardCheck className="w-10 h-10 text-primary-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary-800 mb-4">
              التقييم الأولي المجاني
            </h1>
            <p className="text-lg text-primary-600 leading-relaxed mb-8">
              هذا التقييم المبدئي يساعدنا على فهم احتياجات طفلك بشكل أفضل. يتكون
              من {questions.length} أسئلة بسيطة حول الانتباه، القراءة، السلوك،
              والكتابة.
            </p>

            <Card className="mb-8">
              <CardContent>
                <h3 className="font-semibold text-primary-800 mb-4">
                  قبل البدء:
                </h3>
                <ul className="text-right space-y-3 text-primary-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                    <span>التقييم يستغرق حوالي 5 دقائق</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                    <span>
                      أجب بناءً على ملاحظاتك لطفلك في الأشهر الثلاثة الأخيرة
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                    <span>لا توجد إجابات صحيحة أو خاطئة</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                    <span>ستحصل على نتائج وتوصيات فورية</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Button
              size="lg"
              onClick={() =>
                setAnswer(currentQuestion.id, answers[currentQuestion.id])
              }
              icon={ArrowLeft}
              iconPosition="end"
            >
              ابدأ التقييم
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (isComplete && result) {
    return (
      <div className="min-h-screen bg-cream py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-primary-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-primary-600" />
              </div>
              <h1 className="text-3xl font-bold text-primary-800 mb-4">
                نتائج التقييم
              </h1>
              <p className="text-primary-600">{result.overallMessage}</p>
            </div>

            {/* Category Scores */}
            <Card className="mb-8">
              <CardContent>
                <h3 className="font-semibold text-primary-800 mb-6">
                  ملخص النتائج حسب المجال:
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {Object.entries(result.categories).map(([key, value]) => {
                    const info = categoryInfo[key];
                    const percentage = Math.round(
                      (value.score / value.max) * 100,
                    );
                    const isHighScore = percentage >= 50;

                    return (
                      <div key={key} className="p-4 bg-cream rounded-xl">
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className={`w-10 h-10 rounded-xl ${info.color} flex items-center justify-center`}
                          >
                            <info.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium text-primary-800">
                              {info.label}
                            </p>
                            <p className="text-sm text-primary-500">
                              {isHighScore ? "يحتاج اهتمام" : "جيد"}
                            </p>
                          </div>
                        </div>
                        <div className="w-full h-3 bg-secondary-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isHighScore ? "bg-amber-500" : "bg-primary-500"
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            {result.recommendations.length > 0 && (
              <Card className="mb-8">
                <CardContent>
                  <div className="flex items-center gap-2 mb-6">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                    <h3 className="font-semibold text-primary-800">
                      توصياتنا:
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {result.recommendations.map((rec, index) => (
                      <div
                        key={index}
                        className="p-4 bg-amber-50 border border-amber-200 rounded-xl"
                      >
                        <p className="font-medium text-primary-800 mb-1">
                          {rec.area}
                        </p>
                        <p className="text-sm text-primary-600 mb-2">
                          {rec.description}
                        </p>
                        <p className="text-sm font-medium text-primary-700">
                          البرنامج المقترح: {rec.program}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex flex-col items-center gap-4 justify-center">
              {isAuthenticated ? (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-4 w-full max-w-sm"
                >
                  {/* First & Last Name */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="الاسم الأول"
                      value={form.firstName}
                      onChange={(e) =>
                        setForm({ ...form, firstName: e.target.value })
                      }
                      required
                      className="input-base pr-12"
                    />
                    <input
                      type="text"
                      placeholder="الاسم الأخير"
                      value={form.lastName}
                      onChange={(e) =>
                        setForm({ ...form, lastName: e.target.value })
                      }
                      required
                      className="input-base pr-12"
                    />
                  </div>

                  {/* Date of Birth */}
                  <input
                    type="date"
                    value={form.dateOfBirth}
                    onChange={(e) =>
                      setForm({ ...form, dateOfBirth: e.target.value })
                    }
                    required
                    className="input-base pr-12"
                  />

                  {/* Gender */}
                  <select
                    value={form.gender}
                    onChange={(e) =>
                      setForm({ ...form, gender: e.target.value })
                    }
                    required
                    className="input-base pr-12"
                  >
                    <option value="male">ذكر</option>
                    <option value="female">أنثى</option>
                  </select>

                  <Button
                    type="submit"
                    size="lg"
                    icon={ArrowLeft}
                    iconPosition="end"
                    disabled={isLoading}
                  >
                    {isLoading
                      ? "جاري الحفظ..."
                      : "احفظ وانتقل إلى لوحة التحكم"}
                  </Button>
                </form>
              ) : (
                <Link to="/signup">
                  <Button size="lg" icon={ArrowLeft} iconPosition="end">
                    أنشئ حساباً لحفظ النتائج
                  </Button>
                </Link>
              )}
              <aside>
                <Link to="/services">
                  <Button variant="outline" size="lg">
                    عرض الخدمات
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="lg"
                  icon={RefreshCcw}
                  onClick={handleStartOver}
                >
                  إعادة التقييم
                </Button>
              </aside>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Questions Screen
  const CategoryIcon = categoryInfo[currentQuestion.category].icon;

  return (
    <div className="min-h-screen bg-cream py-12">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm text-primary-600 mb-2">
              <span>
                السؤال {currentStep + 1} من {questions.length}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 bg-secondary-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <Card className="mb-8">
            <CardContent>
              {/* Category Badge */}
              <div
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl ${categoryInfo[currentQuestion.category].color} text-sm font-medium mb-6`}
              >
                <CategoryIcon className="w-4 h-4" />
                <span>{categoryInfo[currentQuestion.category].label}</span>
              </div>

              {/* Question */}
              <h2 className="text-xl md:text-2xl font-semibold text-primary-800 mb-8 leading-relaxed">
                {currentQuestion.question}
              </h2>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setAnswer(currentQuestion.id, option.value)}
                    className={`w-full p-4 rounded-xl border-2 text-right transition-all ${
                      answers[currentQuestion.id] === option.value
                        ? "border-primary-500 bg-primary-50 text-primary-700"
                        : "border-secondary-200 hover:border-primary-300 text-primary-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          answers[currentQuestion.id] === option.value
                            ? "border-primary-500 bg-primary-500"
                            : "border-secondary-300"
                        }`}
                      >
                        {answers[currentQuestion.id] === option.value && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <span className="font-medium">{option.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={currentStep === 0}
              icon={ArrowRight}
            >
              السابق
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canGoNext}
              icon={ArrowLeft}
              iconPosition="end"
            >
              {currentStep === questions.length - 1 ? "عرض النتائج" : "التالي"}
            </Button>
          </div>

          {/* Question Navigation Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {questions.map((_, index) => (
              <button
                key={index}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentStep
                    ? "bg-primary-500 w-6"
                    : answers[questions[index].id] !== undefined
                      ? "bg-primary-300"
                      : "bg-secondary-300"
                }`}
                onClick={() => {
                  if (
                    index < currentStep ||
                    answers[questions[index].id] !== undefined
                  ) {
                    useAssessmentStore.getState().goToStep(index);
                  }
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

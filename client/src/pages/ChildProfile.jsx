import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowRight,
  Calendar,
  Clock,
  FileText,
  TrendingUp,
  Plus,
  BookOpen,
  Brain,
  Heart,
  Edit3,
  ChevronDown,
  ChevronUp,
  Trash2,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Card, {
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/common/Card";
import Button from "@/components/common/Button";
import { useChildStore } from "@/store/childStore";
import { useAssessmentStore } from "../store/assessmentStore";

const skillColors = {
  attention: "#9333ea",
  reading: "#3b82f6",
  behavior: "#f43f5e",
  writing: "#f59e0b",
};

const skillLabels = {
  attention: "التركيز",
  reading: "القراءة",
  behavior: "السلوك",
  writing: "الكتابة",
};

const skillIcons = {
  attention: Brain,
  reading: BookOpen,
  behavior: Heart,
  writing: Edit3,
};

export default function ChildProfile() {
  const { id } = useParams();

  // ✅ ALL hooks at the top — before any return
  const {
    selectedChild,
    getChildById,
    deleteNote,
    deleteChild,
    addNote,
    addAssessment,
    isLoading,
  } = useChildStore();
  const {
    questions,
    currentStep,
    answers,
    setAnswer,
    nextStep,
    prevStep,
    calculateResult,
    resetAssessment,
  } = useAssessmentStore();

  const [showAllNotes, setShowAllNotes] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [showAssessmentForm, setShowAssessmentForm] = useState(false);
  const [assessmentForm, setAssessmentForm] = useState({
    type: "follow-up",
    date: new Date().toISOString().split("T")[0],
    results: { attention: 0, reading: 0, behavior: 0, writing: 0 },
  });

  useEffect(() => {
    getChildById(id);
  }, [id]);

  // ✅ Now safe to use after all hooks
  const child = selectedChild;
  const currentQuestion = questions[currentStep];

  // ✅ Early return AFTER all hooks
  if (!child) {
    return (
      <div className="text-center py-20">
        <p className="text-primary-600">لم يتم العثور على الملف</p>
        <Link
          to="/dashboard/children"
          className="text-primary-700 hover:text-primary-800 font-medium"
        >
          العودة إلى قائمة الأطفال
        </Link>
      </div>
    );
  }

  // ✅ All logic after
  const chartData = child.assessments.map((assessment) => ({
    date: new Date(assessment.date).toLocaleDateString("ar-DZ", {
      month: "short",
    }),
    ...assessment.results,
  }));

  const latestAssessment = child.assessments[child.assessments.length - 1];

  const getProgressComparison = () => {
    if (child.assessments.length < 2) return null;
    const prev = child.assessments[child.assessments.length - 2];
    const current = latestAssessment;
    const prevAvg = Object.values(prev.results).reduce((a, b) => a + b, 0) / 4;
    const currentAvg =
      Object.values(current.results).reduce((a, b) => a + b, 0) / 4;
    return Math.round(currentAvg - prevAvg);
  };

  const progressComparison = getProgressComparison();
  const displayedNotes = showAllNotes ? child.notes : child.notes.slice(-3);

  const handleAddNote = async () => {
    if (newNote.trim()) {
      await addNote(child._id, { content: newNote });
      setNewNote("");
    }
  };
  const dltChild = () => {
    deleteChild(child._id);
  };
  const handleAddAssessment = async () => {
    const result = calculateResult();
    const toPercent = (score, max) => Math.round(((max - score) / max) * 100);
    const results = {
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
    };
    await addAssessment(child._id, {
      type: assessmentForm.type,
      date: assessmentForm.date,
      results,
    });
    resetAssessment();
    setShowAssessmentForm(false);
  };
  const handleDeleteNote = async (noteId) => {
    await deleteNote(child._id, noteId);
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/dashboard/children"
          className="p-2 rounded-xl hover:bg-secondary-100 transition-colors"
        >
          <ArrowRight className="w-5 h-5 text-primary-600" />
        </Link>
        <div className="flex-1">
          <h1>ملف {child.fullName}</h1>
          <p className="text-primary-600">{child.age?.years} سنوات</p>{" "}
        </div>
        <Button
          variant="outline"
          onClick={dltChild}
          className="border-red-400 hover:bg-red-100 text-red-400 "
          icon={Edit3}
        >
          حذف
        </Button>
      </div>

      {/* Profile Overview */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Info & Skills */}
        <div className="space-y-6">
          {/* Profile Card */}
          <Card>
            <CardContent className="text-center">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-primary-700">
                  {child.firstName.charAt(0)}
                </span>
              </div>
              <h2 className="text-xl font-bold text-primary-800 mb-1">
                {child.fullName}
              </h2>
              <p className="text-primary-600 mb-4">
                {child.age?.years} سنوات -{" "}
                {child.gender === "male" ? "ذكر" : "أنثى"}
              </p>

              <div className="flex justify-center gap-2 mb-4">
                {child.enrolledPrograms.map((program) => (
                  <span key={program._id}>
                    {program.category === "concentration"
                      ? "تركيز"
                      : program.category === "reading"
                        ? "قراءة"
                        : program.category === "writing"
                          ? "كتابة"
                          : program.name}
                  </span>
                ))}
              </div>

              {progressComparison !== null && (
                <div
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${
                    progressComparison >= 0
                      ? "bg-primary-100 text-primary-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>
                    {progressComparison >= 0 ? "+" : ""}
                    {progressComparison}% منذ آخر تقييم
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Current Skills */}
          {latestAssessment && (
            <Card>
              <CardHeader>
                <CardTitle>المهارات الحالية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(latestAssessment.results).map(
                    ([skill, value]) => {
                      const Icon = skillIcons[skill];
                      return (
                        <div key={skill}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Icon
                                className="w-4 h-4"
                                style={{ color: skillColors[skill] }}
                              />
                              <span className="text-sm font-medium text-primary-700">
                                {skillLabels[skill]}
                              </span>
                            </div>
                            <span className="text-sm font-bold text-primary-800">
                              {value}%
                            </span>
                          </div>
                          <div className="w-full h-2 bg-secondary-200 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${value}%`,
                                backgroundColor: skillColors[skill],
                              }}
                            />
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Charts & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>تطور المهارات</CardTitle>
              <Button
                size="sm"
                variant="outline"
                icon={Plus}
                onClick={() => setShowAssessmentForm(!showAssessmentForm)}
              >
                إضافة تقييم
              </Button>
            </CardHeader>
            <CardContent>
              {/* Assessment Form */}
              {showAssessmentForm && (
                <div className="mb-6 p-4 bg-cream rounded-xl space-y-4">
                  {/* Type & Date */}
                  <div className="flex gap-3">
                    <select
                      value={assessmentForm.type}
                      onChange={(e) =>
                        setAssessmentForm({
                          ...assessmentForm,
                          type: e.target.value,
                        })
                      }
                      className="input-base flex-1"
                    >
                      <option value="initial">تقييم أولي</option>
                      <option value="follow-up">متابعة</option>
                    </select>
                    <input
                      type="date"
                      value={assessmentForm.date}
                      onChange={(e) =>
                        setAssessmentForm({
                          ...assessmentForm,
                          date: e.target.value,
                        })
                      }
                      className="input-base flex-1"
                    />
                  </div>

                  {/* Progress bar */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-secondary-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full transition-all duration-300"
                        style={{
                          width: `${((currentStep + 1) / questions.length) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-primary-500 shrink-0">
                      {currentStep + 1} / {questions.length}
                    </span>
                  </div>

                  {/* Question */}
                  <div className="py-2">
                    <p className="text-sm text-primary-500 mb-1">
                      {skillLabels[currentQuestion.category]}
                    </p>
                    <p className="font-medium text-primary-800 text-right leading-relaxed">
                      {currentQuestion.question}
                    </p>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-2 gap-2">
                    {currentQuestion.options.map((option) => (
                      <button
                        key={option.value}
                        onClick={() =>
                          setAnswer(currentQuestion.id, option.value)
                        }
                        className={`p-3 rounded-xl text-sm font-medium border-2 transition-all ${
                          answers[currentQuestion.id] === option.value
                            ? "border-primary-500 bg-primary-100 text-primary-700"
                            : "border-secondary-200 bg-white text-primary-600 hover:border-primary-300"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>

                  {/* Navigation */}
                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="outline"
                      onClick={
                        currentStep === 0
                          ? () => {
                              resetAssessment();
                              setShowAssessmentForm(false);
                            }
                          : prevStep
                      }
                      className="flex-1"
                    >
                      {currentStep === 0 ? "إلغاء" : "السابق"}
                    </Button>

                    {currentStep < questions.length - 1 ? (
                      <Button
                        onClick={nextStep}
                        disabled={answers[currentQuestion.id] === undefined}
                        className="flex-1"
                      >
                        التالي
                      </Button>
                    ) : (
                      <Button
                        onClick={handleAddAssessment}
                        disabled={
                          answers[currentQuestion.id] === undefined || isLoading
                        }
                        className="flex-1"
                      >
                        {isLoading ? "جاري الحفظ..." : "حفظ التقييم"}
                      </Button>
                    )}
                  </div>
                </div>
              )}
              {chartData.length > 1 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0d5c5" />
                      <XAxis dataKey="date" stroke="#5f5143" />
                      <YAxis domain={[0, 100]} stroke="#5f5143" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e0d5c5",
                          borderRadius: "12px",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="attention"
                        name="التركيز"
                        stroke={skillColors.attention}
                        strokeWidth={2}
                        dot={{ fill: skillColors.attention }}
                      />
                      <Line
                        type="monotone"
                        dataKey="reading"
                        name="القراءة"
                        stroke={skillColors.reading}
                        strokeWidth={2}
                        dot={{ fill: skillColors.reading }}
                      />
                      <Line
                        type="monotone"
                        dataKey="behavior"
                        name="السلوك"
                        stroke={skillColors.behavior}
                        strokeWidth={2}
                        dot={{ fill: skillColors.behavior }}
                      />
                      <Line
                        type="monotone"
                        dataKey="writing"
                        name="الكتابة"
                        stroke={skillColors.writing}
                        strokeWidth={2}
                        dot={{ fill: skillColors.writing }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center text-primary-500">
                  <p>يتطلب عرض الرسم البياني تقييمين على الأقل</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sessions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>الجلسات</CardTitle>
              <Button size="sm" variant="outline" icon={Plus}>
                حجز جلسة
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {child.sessions.map((session) => (
                  <div
                    key={session._id}
                    className={`flex items-center gap-4 p-4 rounded-xl ${
                      session.status === "upcoming"
                        ? "bg-primary-50"
                        : "bg-cream"
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full ${
                        session.status === "upcoming"
                          ? "bg-primary-500"
                          : "bg-secondary-400"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-primary-800">
                        جلسة {session.type === "therapy" ? "دعم نفسي" : "تعلم"}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-primary-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(session.date).toLocaleDateString("ar-DZ")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {session.time}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        session.status === "upcoming"
                          ? "bg-primary-100 text-primary-700"
                          : "bg-secondary-200 text-primary-600"
                      }`}
                    >
                      {session.status === "upcoming" ? "قادمة" : "مكتملة"}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>الملاحظات</CardTitle>
              {child.notes.length > 3 && (
                <button
                  onClick={() => setShowAllNotes(!showAllNotes)}
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  {showAllNotes ? "عرض أقل" : "عرض الكل"}
                  {showAllNotes ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              )}
            </CardHeader>
            <CardContent>
              {/* Add Note */}
              <div className="flex gap-3 mb-6">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
                  placeholder="أضف ملاحظة جديدة..."
                  className="input-base flex-1"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleAddNote}
                  icon={Plus}
                  disabled={isLoading}
                >
                  {isLoading ? "..." : "إضافة"}
                </Button>
              </div>

              {/* Notes List */}
              <div className="space-y-3">
                {displayedNotes.length > 0 ? (
                  [...displayedNotes].reverse().map((note) => (
                    <div
                      key={note._id}
                      className="flex gap-3 p-4 bg-cream rounded-xl group"
                    >
                      <FileText className="w-5 h-5 text-primary-400 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-primary-700">{note.content}</p>
                        <p className="text-xs text-primary-500 mt-1">
                          {new Date(
                            note.date || note.createdAt,
                          ).toLocaleDateString("ar-DZ")}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteNote(note._id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-red-100 text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-primary-500 py-4">
                    لا توجد ملاحظات
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

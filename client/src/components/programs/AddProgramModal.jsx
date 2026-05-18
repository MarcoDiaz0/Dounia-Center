import { useState } from "react";
import { X, Save, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../common/Button";
import Card, { CardContent } from "../common/Card";

export default function AddProgramModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "general",
    price: "",
    duration: "",
    icon: "BookOpen",
    longDescription: "",
    features: [""],
  });

  const categories = [
    { id: "general", name: "عام" },
    { id: "concentration", name: "التركيز" },
    { id: "reading", name: "القراءة" },
    { id: "writing", name: "الكتابة" },
    { id: "behavior", name: "السلوك" },
  ];

  const icons = [
    "BookOpen", "Heart", "Brain", "Users", "Calendar", "GraduationCap", "Shield", "Star"
  ];

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeatureField = () => {
    setFormData({ ...formData, features: [...formData.features, ""] });
  };

  const removeFeatureField = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Filter out empty features
      const cleanData = {
        ...formData,
        features: formData.features.filter(f => f.trim() !== "")
      };
      await onAdd(cleanData);
      toast.success("تمت إضافة البرنامج بنجاح");
      onClose();
      setFormData({
        name: "",
        description: "",
        category: "general",
        price: "",
        duration: "",
        icon: "BookOpen",
        longDescription: "",
        features: [""],
      });
    } catch (err) {
      toast.error("فشل إضافة البرنامج");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-in">
        <div className="p-6 border-b border-secondary-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary-800">إضافة برنامج جديد</h2>
          <button onClick={onClose} className="p-2 hover:bg-secondary-50 rounded-xl transition-colors">
            <X className="w-5 h-5 text-primary-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-700">اسم البرنامج</label>
              <input
                required
                className="input-base"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="مثال: تحسين القراءة"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-700">الفئة</label>
              <select
                className="input-base"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-700">السعر (د.ج)</label>
              <input
                required
                className="input-base"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="مثال: 5,000"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-700">المدة</label>
              <input
                required
                className="input-base"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="مثال: جلسة 45 دقيقة"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-primary-700">وصف قصير</label>
            <input
              required
              className="input-base"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="وصف يظهر في البطاقة"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-primary-700">وصف تفصيلي</label>
            <textarea
              className="input-base min-h-[100px]"
              value={formData.longDescription}
              onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
              placeholder="شرح كامل للبرنامج وأهدافه"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-primary-700">المميزات</label>
            <div className="space-y-3">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    className="input-base flex-1"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder={`ميزة ${index + 1}`}
                  />
                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeatureField(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                icon={Plus}
                onClick={addFeatureField}
                className="w-full border-dashed"
              >
                إضافة ميزة أخرى
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-primary-700">الأيقونة</label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {icons.map(iconName => (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon: iconName })}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    formData.icon === iconName ? "border-primary-500 bg-primary-50" : "border-secondary-100 hover:border-primary-200"
                  }`}
                >
                  <span className="text-xs">{iconName}</span>
                </button>
              ))}
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-secondary-100 bg-secondary-50 flex gap-4">
          <Button onClick={handleSubmit} className="flex-1" icon={Save}>حفظ البرنامج</Button>
          <Button onClick={onClose} variant="outline" className="flex-1">إلغاء</Button>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Button from "../common/Button";
import { useAuthStore } from "@/store/authStore";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login({
        email,
        password,
      });
      toast.success("مرحباً بك مجدداً!");
      navigate("/dashboard");
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "فشل تسجيل الدخول";
      setError(message);
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-primary-700"
        >
          البريد الإلكتروني
        </label>

        <div className="relative">
          <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />

          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-base pr-12"
            placeholder="أدخل بريدك الإلكتروني"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-primary-700"
        >
          كلمة المرور
        </label>

        <div className="relative">
          <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />

          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-base pr-12 pl-12"
            placeholder="أدخل كلمة المرور"
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400 hover:text-primary-600"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-secondary-300 text-primary-500 focus:ring-primary-500"
          />
          <span className="text-sm text-primary-600">تذكرني</span>
        </label>

        <Link
          to="/forgot-password"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          نسيت كلمة المرور؟
        </Link>
      </div>

      <Button
        type="submit"
        className="w-full"
        loading={isLoading}
        disabled={isLoading}
        icon={ArrowLeft}
        iconPosition="end"
      >
        تسجيل الدخول
      </Button>

      <p className="text-center text-sm text-primary-600">
        ليس لديك حساب؟{" "}
        <Link
          to="/signup"
          className="font-medium text-primary-700 hover:text-primary-800"
        >
          سجل الآن
        </Link>
      </p>
    </form>
  );
}

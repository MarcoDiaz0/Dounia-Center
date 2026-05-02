import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Leaf, ChevronDown, User, LogIn } from "lucide-react";
import { clsx } from "clsx";
import Button from "./Button";
import { useAuthStore } from "@/store/authStore";

const navLinks = [
  { name: "الرئيسية", href: "/" },
  { name: "خدماتنا", href: "/services" },
  { name: "التقييم المجاني", href: "/assessment" },
  { name: "المصادر", href: "/resources" },
  // { name: 'تواصل معنا', href: '/#contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout, checkAuth } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);
  useEffect(() => {
    checkAuth();
  }, [isAuthenticated]);
  return (
    <header
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-soft py-3"
          : "bg-transparent py-5",
      )}
    >
      <nav className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-primary-800 text-lg">دنيا</span>
              <span className="block text-xs text-primary-600">
                للنمو والتعلم المتكامل
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={clsx(
                  "text-sm font-medium transition-colors duration-200 relative py-2",
                  location.pathname === link.href
                    ? "text-primary-600"
                    : "text-primary-700 hover:text-primary-500",
                )}
              >
                {link.name}
                {location.pathname === link.href && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to="/dashboard">
                  <Button variant="secondary" size="sm" icon={User}>
                    لوحة التحكم
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={logout}>
                  تسجيل الخروج
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" icon={LogIn}>
                    تسجيل الدخول
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">
                    إنشاء حساب
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl hover:bg-primary-50 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-primary-700" />
            ) : (
              <Menu className="w-6 h-6 text-primary-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={clsx(
            "lg:hidden overflow-hidden transition-all duration-300",
            isMobileMenuOpen ? "max-h-[500px] mt-4" : "max-h-0",
          )}
        >
          <div className="bg-white rounded-2xl shadow-soft p-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={clsx(
                  "block px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  location.pathname === link.href
                    ? "bg-primary-50 text-primary-600"
                    : "text-primary-700 hover:bg-primary-50",
                )}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 mt-4 border-t border-secondary-200 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="block">
                    <Button variant="secondary" className="w-full" icon={User}>
                      لوحة التحكم
                    </Button>
                  </Link>
                  <Button variant="ghost" className="w-full" onClick={logout}>
                    تسجيل الخروج
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block">
                    <Button variant="ghost" className="w-full" icon={LogIn}>
                      تسجيل الدخول
                    </Button>
                  </Link>
                  <Link to="/signup" className="block">
                    <Button variant="primary" className="w-full">
                      إنشاء حساب
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";
import logoImg from "@/assets/logo.png";

const contactInfo = {
  locationLabel: "أم البواقي، الجزائر",
  locationHref:
    "https://www.google.com/maps/search/?api=1&query=Oum+El+Bouaghi+Algeria",
  phoneLabel: "00000....",
  phoneHref: "tel:00000",
  email: "dounia.center0@gmail.com",
};

const footerLinks = {
  services: [
    { name: "الدعم النفسي", href: "/services" },
    { name: "صعوبات التعلم", href: "/services" },
    { name: "تحسين القراءة والكتابة", href: "/services" },
    { name: "توجيه الأولياء", href: "/services" },
  ],
  resources: [
    { name: "المقالات", href: "/resources?type=article" },
    { name: "الفيديوهات", href: "/resources?type=video" },
    { name: "التمارين", href: "/resources?type=activity" },
    { name: "التوجيه", href: "/resources?type=guide" },
  ],
};

const socialLinks = [
  {
    icon: Facebook,
    href: "https://www.facebook.com/profile.php?id=61590388108868",
    label: "Facebook",
  },
  {
    icon: Instagram,
    href: "https://www.instagram.com/dounia.innergrowth?igsh=eW12dG95OWYwZTM5",
    label: "Instagram",
  },
];

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-white">
      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center overflow-hidden">
                <img
                  src={logoImg}
                  alt="Dounia Logo"
                  className="w-10 h-10  object-contain"
                />
              </div>
              <div>
                <span className="font-bold text-xl">مركز دنيا</span>
                <span className="block text-sm text-primary-300">
                  للنمو الداخلي والتعلم المتكامل
                </span>
              </div>
            </Link>
            <p className="text-primary-200 mb-6 max-w-sm leading-relaxed">
              نرافقكم نحو نمو نفسي وتعليمي متوازن. نقدم خدمات متخصصة في الدعم
              النفسي والتربوي للأطفال والعائلات.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-primary-500 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-lg mb-4">خدماتنا</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-primary-200 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-lg mb-4">المصادر</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-primary-200 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">تواصل معنا</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href={contactInfo.locationHref}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-3 text-primary-200 hover:text-white transition-colors"
                >
                  <MapPin className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                  <span>{contactInfo.locationLabel}</span>
                </a>
              </li>
              <li>
                <a
                  href={contactInfo.phoneHref}
                  className="flex items-center gap-3 text-primary-200 hover:text-white transition-colors"
                >
                  <Phone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                  <span className="direction-ltr">
                    {contactInfo.phoneLabel}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="flex items-center gap-3 text-primary-200 hover:text-white transition-colors"
                >
                  <Mail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                  <span>{contactInfo.email}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-800">
        <div className="container-custom py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-300 text-sm">
            &copy; {new Date().getFullYear()} مركز دنيا للنمو الداخلي والتعلم
            المتكامل. جميع الحقوق محفوظة.
          </p>
          <div className="flex gap-6 text-sm">
            <Link
              to="/privacy"
              className="text-primary-300 hover:text-white transition-colors"
            >
              سياسة الخصوصية
            </Link>
            <Link
              to="/terms"
              className="text-primary-300 hover:text-white transition-colors"
            >
              شروط الاستخدام
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { Link } from 'react-router-dom'
import { Leaf, Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react'

const footerLinks = {
  services: [
    { name: 'الدعم النفسي', href: '/services' },
    { name: 'صعوبات التعلم', href: '/services' },
    { name: 'تحسين القراءة والكتابة', href: '/services' },
    { name: 'توجيه الأولياء', href: '/services' },
  ],
  resources: [
    { name: 'المقالات', href: '/resources' },
    { name: 'الفيديوهات', href: '/resources' },
    { name: 'التمارين', href: '/resources' },
    { name: 'الاختبارات', href: '/resources' },
  ],
  company: [
    { name: 'من نحن', href: '/#about' },
    { name: 'فريقنا', href: '/#team' },
    { name: 'الشهادات', href: '/#testimonials' },
    { name: 'تواصل معنا', href: '/#contact' },
  ],
}

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Youtube, href: '#', label: 'Youtube' },
]

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-white">
      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <Leaf className="w-7 h-7 text-primary-300" />
              </div>
              <div>
                <span className="font-bold text-xl">مركز دنيا</span>
                <span className="block text-sm text-primary-300">للنمو الداخلي والتعلم المتكامل</span>
              </div>
            </Link>
            <p className="text-primary-200 mb-6 max-w-sm leading-relaxed">
              نرافقكم نحو نمو نفسي وتعليمي متوازن. نقدم خدمات متخصصة في الدعم النفسي والتربوي للأطفال والعائلات.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
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
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                <span className="text-primary-200">الجزائر العاصمة، الجزائر</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <span className="text-primary-200 direction-ltr">+213 555 123 456</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <span className="text-primary-200">contact@dounia-center.dz</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-800">
        <div className="container-custom py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-300 text-sm">
            &copy; {new Date().getFullYear()} مركز دنيا للنمو الداخلي والتعلم المتكامل. جميع الحقوق محفوظة.
          </p>
          <div className="flex gap-6 text-sm">
            <Link to="/privacy" className="text-primary-300 hover:text-white transition-colors">
              سياسة الخصوصية
            </Link>
            <Link to="/terms" className="text-primary-300 hover:text-white transition-colors">
              شروط الاستخدام
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

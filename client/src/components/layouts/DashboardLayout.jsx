import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { clsx } from 'clsx'
import {
  Leaf,
  LayoutDashboard,
  ClipboardList,
  Users,
  Calendar,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  BookOpen,
  TrendingUp,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import Button from '../common/Button'

const sidebarLinks = [
  { name: 'لوحة التحكم', href: '/dashboard', icon: LayoutDashboard },
  { name: 'نتائج التقييم', href: '/dashboard/assessments', icon: ClipboardList },
  { name: 'ملفات الأطفال', href: '/dashboard/children', icon: Users },
  { name: 'البرامج المسجلة', href: '/dashboard/programs', icon: BookOpen },
  { name: 'الجلسات القادمة', href: '/dashboard/sessions', icon: Calendar },
  { name: 'التقدم', href: '/dashboard/progress', icon: TrendingUp },
  { name: 'الإشعارات', href: '/dashboard/notifications', icon: Bell },
  { name: 'الإعدادات', href: '/dashboard/settings', icon: Settings },
]

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-soft">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-xl hover:bg-primary-50 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6 text-primary-700" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-primary-800">دنيا</span>
          </Link>
          <div className="w-10" />
        </div>
      </header>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 right-0 bottom-0 w-72 bg-white shadow-xl z-50 transition-transform duration-300',
          'lg:translate-x-0 lg:shadow-soft',
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-secondary-200">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="font-bold text-primary-800">مركز دنيا</span>
                  <span className="block text-xs text-primary-600">لوحة التحكم</span>
                </div>
              </Link>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-2 rounded-xl hover:bg-primary-50 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-primary-700" />
              </button>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 mx-4 mt-4 bg-primary-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-200 rounded-full flex items-center justify-center">
                <span className="text-primary-700 font-semibold">
                  {user?.name?.charAt(0) || 'م'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-primary-800 truncate">{user?.name || 'مستخدم'}</p>
                <p className="text-sm text-primary-600 truncate">{user?.email || 'user@example.com'}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-1">
              {sidebarLinks.map((link) => {
                const isActive = location.pathname === link.href
                return (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className={clsx(
                        'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                        isActive
                          ? 'bg-primary-500 text-white shadow-md'
                          : 'text-primary-700 hover:bg-primary-50'
                      )}
                    >
                      <link.icon className="w-5 h-5 flex-shrink-0" />
                      <span>{link.name}</span>
                      {isActive && <ChevronLeft className="w-4 h-4 mr-auto" />}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-secondary-200">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
              icon={LogOut}
              onClick={handleLogout}
            >
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:mr-72 min-h-screen pt-16 lg:pt-0">
        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

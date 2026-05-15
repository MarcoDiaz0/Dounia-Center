import { useState, useEffect } from 'react'
import {
  Search,
  FileText,
  Video,
  BookOpen,
  ClipboardList,
  Download,
  Play,
  Clock,
  Filter,
  X,
  Plus,
  Trash2,
} from 'lucide-react'
import toast from 'react-hot-toast'
import Card, { CardContent } from '@/components/common/Card'
import SectionTitle from '@/components/common/SectionTitle'
import Button from '@/components/common/Button'
import resourceService from '@/services/resourceService'
import { useAuthStore } from '@/store/authStore'
import AddResourceModal from '@/components/resources/AddResourceModal'

const categories = [
  { id: 'all', name: 'الكل', icon: BookOpen },
  { id: 'article', name: 'المقالات', icon: FileText },
  { id: 'video', name: 'الفيديوهات', icon: Video },
  { id: 'activity', name: 'التمارين', icon: ClipboardList },
  { id: 'guide', name: 'الأدلة', icon: BookOpen },
  { id: 'worksheet', name: 'أوراق العمل', icon: FileText },
  { id: 'tool', name: 'الأدوات', icon: ClipboardList },
]

const typeIcons = {
  article: FileText,
  video: Video,
  activity: ClipboardList,
  guide: BookOpen,
  worksheet: FileText,
  tool: ClipboardList,
  pdfs: FileText, // Fallback for legacy
}

const typeColors = {
  article: 'bg-blue-100 text-blue-600',
  video: 'bg-rose-100 text-rose-600',
  activity: 'bg-amber-100 text-amber-600',
  guide: 'bg-teal-100 text-teal-600',
  worksheet: 'bg-purple-100 text-purple-600',
  tool: 'bg-emerald-100 text-emerald-600',
}

export default function Resources() {
  const { user } = useAuthStore()
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    fetchResources()
  }, [selectedCategory])

  const fetchResources = async () => {
    try {
      setLoading(true)
      const params = {}
      if (selectedCategory !== 'all') {
        params.type = selectedCategory
      }
      const response = await resourceService.getResources(params)
      setResources(response.data.resources)
      setError(null)
    } catch (err) {
      setError('Failed to fetch resources')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filteredResources = resources.filter((resource) => {
    const title = resource.title?.ar || resource.title?.en || resource.title || ''
    const description = resource.description?.ar || resource.description?.en || resource.description || ''
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const featuredResources = resources.filter((r) => r.isFeatured)

  const ResourceCard = ({ resource }) => {
    const Icon = typeIcons[resource.type] || BookOpen
    const colorClass = typeColors[resource.type] || 'bg-gray-100 text-gray-600'
    const title = resource.title?.ar || resource.title?.en || resource.title
    const description = resource.description?.ar || resource.description?.en || resource.description

    const handleDelete = async (id) => {
      if (window.confirm('هل أنت متأكد من حذف هذا المصدر؟ سيتم حذفه من القاعدة ومن كلاوديناري أيضاً.')) {
        try {
          await resourceService.deleteResource(id)
          fetchResources()
          toast.success('تم حذف المصدر بنجاح')
        } catch (err) {
          toast.error('فشل حذف المصدر')
          console.error(err)
        }
      }
    }

    return (
      <Card hover className="h-full flex flex-col">
        <CardContent className="flex flex-col h-full">
          <div className="flex items-start gap-4 mb-4">
            <div className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center flex-shrink-0`}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <span className={`inline-block px-2 py-1 rounded-lg text-xs font-medium ${colorClass} mb-2`}>
                {categories.find((c) => c.id === resource.type)?.name || resource.type}
              </span>
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold text-primary-800 line-clamp-2">{title}</h3>
                {isAdmin && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(resource._id)
                    }}
                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <p className="text-sm text-primary-600 mb-4 flex-1 line-clamp-2">{description}</p>

          <div className="flex items-center justify-between mt-auto pt-4 border-t border-secondary-100">
            <div className="flex items-center gap-2 text-sm text-primary-500">
              <Clock className="w-4 h-4" />
              <span>
                {resource.duration ? `${resource.duration} دقيقة` : 'مصدر تعليمي'}
              </span>
            </div>
            <div className="flex gap-2">
              {resource.mediaUrl && (
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => window.open(resource.mediaUrl, '_blank')}
                >
                  {resource.type === 'video' ? (
                    <>
                      <Play className="w-4 h-4" />
                      شاهد
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      تحميل
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-bl from-cream via-white to-secondary-100 py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-800 mb-6">
              مكتبة المصادر
            </h1>
            <p className="text-lg text-primary-600 leading-relaxed mb-8">
              موارد تعليمية متنوعة للأهل والمعلمين لدعم الأطفال في رحلتهم التعليمية
            </p>

            {/* Search and Add */}
            <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث في المصادر..."
                  className="input-base pr-12"
                />
              </div>
              {isAdmin && (
                <Button 
                  className="flex items-center gap-2 whitespace-nowrap"
                  onClick={() => setIsModalOpen(true)}
                >
                  <Plus className="w-5 h-5" />
                  إضافة مصدر
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      {!loading && featuredResources.length > 0 && searchQuery === '' && selectedCategory === 'all' && (
        <section className="py-12 bg-white">
          <div className="container-custom">
            <SectionTitle
              title="مصادر مميزة"
              subtitle="أحدث وأهم المصادر المختارة لكم"
              align="right"
            />
            <div className="grid md:grid-cols-2 gap-6">
              {featuredResources.map((resource) => (
                <ResourceCard key={resource._id} resource={resource} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="section-padding bg-cream">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:w-64 flex-shrink-0">
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden w-full flex items-center justify-between p-4 bg-white rounded-xl shadow-soft mb-4"
              >
                <span className="font-medium text-primary-800">تصفية حسب النوع</span>
                <Filter className="w-5 h-5 text-primary-600" />
              </button>

              <div className={`bg-white rounded-2xl shadow-soft p-4 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
                <h3 className="font-semibold text-primary-800 mb-4">تصفية حسب النوع</h3>
                <ul className="space-y-2">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <button
                        onClick={() => {
                          setSelectedCategory(category.id)
                          setShowMobileFilters(false)
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                          selectedCategory === category.id
                            ? 'bg-primary-500 text-white'
                            : 'text-primary-700 hover:bg-primary-50'
                        }`}
                      >
                        <category.icon className="w-5 h-5" />
                        <span>{category.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Resources Grid */}
            <div className="flex-1">
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                </div>
              ) : error ? (
                <div className="text-center py-16 bg-white rounded-2xl text-red-500">
                  {error}
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-primary-600">
                      <span className="font-semibold text-primary-800">{filteredResources.length}</span> نتيجة
                    </p>
                    {(searchQuery || selectedCategory !== 'all') && (
                      <button
                        onClick={() => {
                          setSearchQuery('')
                          setSelectedCategory('all')
                        }}
                        className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                      >
                        <X className="w-4 h-4" />
                        مسح الفلاتر
                      </button>
                    )}
                  </div>

                  {filteredResources.length > 0 ? (
                    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredResources.map((resource) => (
                        <ResourceCard key={resource._id} resource={resource} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-white rounded-2xl">
                      <Search className="w-16 h-16 text-primary-200 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-primary-800 mb-2">لا توجد نتائج</h3>
                      <p className="text-primary-600">جرب البحث بكلمات مختلفة أو تغيير الفلاتر</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <AddResourceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRefresh={fetchResources}
      />
    </div>
  )
}

import { useState } from 'react'
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
} from 'lucide-react'
import Card, { CardContent } from '@/components/common/Card'
import SectionTitle from '@/components/common/SectionTitle'
import Button from '@/components/common/Button'

const categories = [
  { id: 'all', name: 'الكل', icon: BookOpen },
  { id: 'articles', name: 'المقالات', icon: FileText },
  { id: 'videos', name: 'الفيديوهات', icon: Video },
  { id: 'exercises', name: 'التمارين', icon: ClipboardList },
  { id: 'tests', name: 'الاختبارات', icon: ClipboardList },
  { id: 'pdfs', name: 'ملفات PDF', icon: FileText },
]

const resources = [
  {
    id: 1,
    type: 'articles',
    title: 'كيف تدعم طفلك في التغلب على صعوبات القراءة',
    description: 'دليل شامل للأهل حول كيفية مساعدة أطفالهم على تحسين مهارات القراءة',
    readTime: '8 دقائق',
    thumbnail: null,
    featured: true,
  },
  {
    id: 2,
    type: 'videos',
    title: 'تمارين تحسين التركيز للأطفال',
    description: 'فيديو تعليمي يشرح تمارين بسيطة لتحسين تركيز الأطفال',
    duration: '12 دقيقة',
    thumbnail: null,
  },
  {
    id: 3,
    type: 'exercises',
    title: 'أنشطة تفاعلية لتطوير المهارات الحركية الدقيقة',
    description: 'مجموعة من الأنشطة الممتعة لتحسين المهارات الحركية الدقيقة',
    items: 15,
    thumbnail: null,
  },
  {
    id: 4,
    type: 'pdfs',
    title: 'دليل الأهل: فهم اضطراب فرط الحركة ونقص الانتباه',
    description: 'ملف PDF شامل يشرح ADHD وكيفية التعامل معه',
    pages: 25,
    thumbnail: null,
  },
  {
    id: 5,
    type: 'tests',
    title: 'اختبار مؤشرات صعوبات التعلم',
    description: 'اختبار تقييمي مبدئي لتحديد مؤشرات صعوبات التعلم',
    questions: 20,
    thumbnail: null,
  },
  {
    id: 6,
    type: 'articles',
    title: 'أهمية اللعب في تطوير مهارات الطفل',
    description: 'كيف يساهم اللعب في نمو الطفل النفسي والعقلي',
    readTime: '6 دقائق',
    thumbnail: null,
  },
  {
    id: 7,
    type: 'videos',
    title: 'كيف تتحدث مع طفلك عن المشاعر',
    description: 'نصائح للأهل حول كيفية مناقشة المشاعر مع الأطفال',
    duration: '10 دقائق',
    thumbnail: null,
  },
  {
    id: 8,
    type: 'exercises',
    title: 'تمارين الاسترخاء للأطفال القلقين',
    description: 'تقنيات بسيطة لمساعدة الأطفال على الاسترخاء',
    items: 8,
    thumbnail: null,
  },
  {
    id: 9,
    type: 'pdfs',
    title: 'خطة تنظيم الوقت للطالب',
    description: 'جداول وخطط لمساعدة الطلاب على تنظيم وقتهم',
    pages: 10,
    thumbnail: null,
  },
  {
    id: 10,
    type: 'articles',
    title: 'التعامل مع قلق الامتحانات',
    description: 'استراتيجيات فعالة للتغلب على قلق الامتحانات',
    readTime: '7 دقائق',
    thumbnail: null,
    featured: true,
  },
  {
    id: 11,
    type: 'videos',
    title: 'ألعاب تعليمية لتحسين الذاكرة',
    description: 'ألعاب ممتعة تساعد على تقوية ذاكرة الطفل',
    duration: '15 دقيقة',
    thumbnail: null,
  },
  {
    id: 12,
    type: 'tests',
    title: 'تقييم مهارات القراءة',
    description: 'اختبار لتقييم مستوى مهارات القراءة عند الطفل',
    questions: 15,
    thumbnail: null,
  },
]

const typeIcons = {
  articles: FileText,
  videos: Video,
  exercises: ClipboardList,
  pdfs: FileText,
  tests: ClipboardList,
}

const typeColors = {
  articles: 'bg-blue-100 text-blue-600',
  videos: 'bg-rose-100 text-rose-600',
  exercises: 'bg-amber-100 text-amber-600',
  pdfs: 'bg-teal-100 text-teal-600',
  tests: 'bg-purple-100 text-purple-600',
}

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.title.includes(searchQuery) || resource.description.includes(searchQuery)
    const matchesCategory = selectedCategory === 'all' || resource.type === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredResources = resources.filter((r) => r.featured)

  const ResourceCard = ({ resource }) => {
    const Icon = typeIcons[resource.type]
    const colorClass = typeColors[resource.type]

    return (
      <Card hover className="h-full flex flex-col">
        <CardContent className="flex flex-col h-full">
          <div className="flex items-start gap-4 mb-4">
            <div className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center flex-shrink-0`}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <span className={`inline-block px-2 py-1 rounded-lg text-xs font-medium ${colorClass} mb-2`}>
                {categories.find((c) => c.id === resource.type)?.name}
              </span>
              <h3 className="font-semibold text-primary-800 line-clamp-2">{resource.title}</h3>
            </div>
          </div>

          <p className="text-sm text-primary-600 mb-4 flex-1 line-clamp-2">{resource.description}</p>

          <div className="flex items-center justify-between mt-auto pt-4 border-t border-secondary-100">
            <div className="flex items-center gap-2 text-sm text-primary-500">
              <Clock className="w-4 h-4" />
              <span>
                {resource.readTime || resource.duration || `${resource.items || resource.questions || resource.pages} ${resource.pages ? 'صفحة' : resource.questions ? 'سؤال' : 'نشاط'}`}
              </span>
            </div>
            <Button size="sm" variant="ghost">
              {resource.type === 'videos' ? (
                <>
                  <Play className="w-4 h-4" />
                  شاهد
                </>
              ) : resource.type === 'pdfs' ? (
                <>
                  <Download className="w-4 h-4" />
                  تحميل
                </>
              ) : (
                'عرض'
              )}
            </Button>
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

            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في المصادر..."
                className="input-base pr-12"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      {featuredResources.length > 0 && searchQuery === '' && selectedCategory === 'all' && (
        <section className="py-12 bg-white">
          <div className="container-custom">
            <SectionTitle
              title="مصادر مميزة"
              subtitle="أحدث وأهم المصادر المختارة لكم"
              align="right"
            />
            <div className="grid md:grid-cols-2 gap-6">
              {featuredResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
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
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden w-full flex items-center justify-between p-4 bg-white rounded-xl shadow-soft mb-4"
              >
                <span className="font-medium text-primary-800">تصفية حسب النوع</span>
                <Filter className="w-5 h-5 text-primary-600" />
              </button>

              {/* Filter List */}
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
                        <span className={`mr-auto text-xs px-2 py-0.5 rounded-full ${
                          selectedCategory === category.id
                            ? 'bg-white/20'
                            : 'bg-primary-100'
                        }`}>
                          {category.id === 'all'
                            ? resources.length
                            : resources.filter((r) => r.type === category.id).length}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Resources Grid */}
            <div className="flex-1">
              {/* Results Header */}
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
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl">
                  <Search className="w-16 h-16 text-primary-200 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-primary-800 mb-2">لا توجد نتائج</h3>
                  <p className="text-primary-600">جرب البحث بكلمات مختلفة أو تغيير الفلاتر</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

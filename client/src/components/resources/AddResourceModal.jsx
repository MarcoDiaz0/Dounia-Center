import { useState } from 'react'
import { X, Upload, FileText, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../common/Button'
import resourceService from '@/services/resourceService'

export default function AddResourceModal({ isOpen, onClose, onRefresh }) {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  
  const [formData, setFormData] = useState({
    title_ar: '',
    title_en: '',
    description_ar: '',
    description_en: '',
    type: 'article',
    category: 'general',
    mediaUrl: '',
    mediaPublicId: '',
  })

  const [file, setFile] = useState(null)

  if (!isOpen) return null

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) return
    try {
      setUploading(true)
      const data = await resourceService.uploadFile(file)
      setFormData({
        ...formData,
        mediaUrl: data.data.url,
        mediaPublicId: data.data.public_id,
      })
      toast.success('تم رفع الملف بنجاح')
      setUploading(false)
      setError(null)
    } catch (err) {
      setUploading(false)
      setError('فشل رفع الملف')
      toast.error('فشل رفع الملف')
      console.error(err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      
      const payload = {
        title: { ar: formData.title_ar, en: formData.title_en },
        description: { ar: formData.description_ar, en: formData.description_en },
        type: formData.type,
        category: formData.category,
        mediaUrl: formData.mediaUrl,
        mediaPublicId: formData.mediaPublicId,
      }

      await resourceService.createResource(payload)
      setSuccess(true)
      toast.success('تمت إضافة المصدر بنجاح')
      setTimeout(() => {
        onRefresh()
        onClose()
        setSuccess(false)
        setFormData({
          title_ar: '', title_en: '', description_ar: '', description_en: '',
          type: 'article', category: 'general', mediaUrl: '', mediaPublicId: ''
        })
        setFile(null)
      }, 1500)
    } catch (err) {
      setError('فشل إضافة المصدر')
      toast.error('فشل إضافة المصدر')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white p-6 border-b border-secondary-100 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-primary-800">إضافة مصدر جديد</h2>
          <button onClick={onClose} className="p-2 hover:bg-secondary-50 rounded-full transition-colors">
            <X className="w-6 h-6 text-primary-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {success ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-primary-800">تمت الإضافة بنجاح</h3>
              <p className="text-primary-600">سيتم تحديث القائمة فوراً</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-primary-700 mb-2">العنوان (عربي)</label>
                  <input
                    required
                    type="text"
                    className="input-base"
                    value={formData.title_ar}
                    onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary-700 mb-2">Title (English)</label>
                  <input
                    required
                    type="text"
                    className="input-base"
                    value={formData.title_en}
                    onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary-700 mb-2">الوصف (عربي)</label>
                <textarea
                  required
                  rows="3"
                  className="input-base"
                  value={formData.description_ar}
                  onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-primary-700 mb-2">النوع</label>
                  <select
                    className="input-base"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="article">مقالة</option>
                    <option value="video">فيديو</option>
                    <option value="activity">تمرين</option>
                    <option value="guide">دليل</option>
                    <option value="worksheet">ورقة عمل</option>
                    <option value="tool">أداة</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary-700 mb-2">الفئة</label>
                  <select
                    className="input-base"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="general">عام</option>
                    <option value="cognitive">إدراكي</option>
                    <option value="motor">حركي</option>
                    <option value="language">لغوي</option>
                    <option value="social">اجتماعي</option>
                    <option value="parenting">تربوي</option>
                  </select>
                </div>
              </div>

              {/* File Upload Section */}
              <div className="p-6 bg-secondary-50 rounded-2xl border-2 border-dashed border-secondary-200">
                <label className="block text-sm font-semibold text-primary-700 mb-4 text-center">رفع ملف (PDF أو صورة)</label>
                
                {!formData.mediaUrl ? (
                  <div className="flex flex-col items-center gap-4">
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".pdf,image/*"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-sm border border-secondary-100 hover:border-primary-300 transition-all"
                    >
                      <Upload className="w-8 h-8 text-primary-400" />
                      <span className="text-sm text-primary-600">{file ? file.name : 'اختر ملفاً'}</span>
                    </label>
                    
                    {file && (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        loading={uploading}
                        onClick={handleUpload}
                      >
                        تأكيد الرفع
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-green-50 p-4 rounded-xl border border-green-100">
                    <div className="flex items-center gap-3">
                      <FileText className="w-6 h-6 text-green-500" />
                      <span className="text-sm text-green-700 font-medium">تم رفع الملف بنجاح</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, mediaUrl: '', mediaPublicId: '' })}
                      className="text-xs text-red-500 underline"
                    >
                      تغيير
                    </button>
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1"
                  loading={loading}
                  disabled={uploading || !formData.mediaUrl}
                >
                  إضافة المصدر
                </Button>
                <Button type="button" variant="secondary" onClick={onClose}>
                  إلغاء
                </Button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  )
}

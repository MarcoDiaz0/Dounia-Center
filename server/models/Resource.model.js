import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: {
    ar: { type: String, required: true, trim: true },
    en: { type: String, required: true, trim: true }
  },
  description: {
    ar: { type: String, required: true, trim: true },
    en: { type: String, required: true, trim: true }
  },
  content: {
    ar: { type: String, trim: true },
    en: { type: String, trim: true }
  },
  type: {
    type: String,
    enum: ['article', 'video', 'activity', 'guide', 'worksheet', 'tool'],
    required: true
  },
  category: {
    type: String,
    enum: ['cognitive', 'motor', 'language', 'social', 'parenting', 'health', 'general'],
    required: true
  },
  ageRange: {
    min: { type: Number, min: 0, max: 18, default: 0 },
    max: { type: Number, min: 0, max: 18, default: 18 }
  },
  thumbnail: {
    type: String,
    default: null
  },
  mediaUrl: {
    type: String,
    default: null
  },
  mediaPublicId: {
    type: String,
    default: null
  },
  duration: {
    type: Number, // in minutes
    default: null
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  program: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program',
    default: null
  }
}, {
  timestamps: true
});

// Indexes
resourceSchema.index({ type: 1, category: 1 });
resourceSchema.index({ tags: 1 });
resourceSchema.index({ isPublished: 1, isFeatured: -1 });
resourceSchema.index({ 'title.ar': 'text', 'title.en': 'text', 'description.ar': 'text', 'description.en': 'text' });

// Transform output
resourceSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  }
});

const Resource = mongoose.model('Resource', resourceSchema);

export default Resource;

import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Setup Storage for generic resources (PDFs, Images, etc.)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Determine folder and resource_type based on file type
    const isPDF = file.mimetype === 'application/pdf';
    
    return {
      folder: 'dounia_center',
      resource_type: isPDF ? 'raw' : 'auto', // 'raw' is required for non-image/video files like PDF in some configurations, but 'auto' usually works
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
      format: isPDF ? 'pdf' : undefined,
    };
  },
});

// File filter to allow PDFs, images, and videos
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'application/pdf' ||
    file.mimetype.startsWith('image/') ||
    file.mimetype.startsWith('video/')
  ) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDFs, images, and videos are allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit to support video files
  }
});

export default upload;

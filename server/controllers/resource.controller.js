import Resource from '../models/Resource.model.js';
import Child from '../models/Child.model.js';
import { v2 as cloudinary } from 'cloudinary';

// Get all resources
export const getResources = async (req, res) => {
  try {
    const { 
      type, 
      category, 
      ageMin, 
      ageMax, 
      search,
      featured,
      program,
      page = 1, 
      limit = 12 
    } = req.query;

    let query = { isPublished: true };
    
    // For non-admins, restrict access to premium resources
    if (req.user && req.user.role !== 'admin') {
      const children = await Child.find({ parent: req.user.id, isActive: true });
      const enrolledPrograms = children.reduce((acc, child) => {
        return [...acc, ...child.enrolledPrograms.map(p => p.toString())];
      }, []);

      // Filter: Public resources OR resources for enrolled programs
      query = {
        ...query,
        $or: [
          { program: null },
          { program: { $in: enrolledPrograms } }
        ]
      };
    }

    if (type) query.type = type;
    if (category) query.category = category;
    if (featured === 'true') query.isFeatured = true;
    if (program) query.program = program;
    
    if (ageMin || ageMax) {
      query['ageRange.min'] = { $lte: parseInt(ageMax) || 18 };
      query['ageRange.max'] = { $gte: parseInt(ageMin) || 0 };
    }

    if (search) {
      query.$text = { $search: search };
    }

    const resources = await Resource.find(query)
      .populate('program', 'name')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ isFeatured: -1, createdAt: -1 });

    const total = await Resource.countDocuments(query);

    res.json({
      success: true,
      data: {
        resources,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resources',
      error: error.message
    });
  }
};

// Get resource by ID
export const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource || !resource.isPublished) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    // Check permissions for premium resources
    if (resource.program && req.user && req.user.role !== 'admin') {
      const children = await Child.find({ parent: req.user.id, isActive: true });
      const enrolledPrograms = children.reduce((acc, child) => {
        return [...acc, ...child.enrolledPrograms.map(p => p.toString())];
      }, []);

      if (!enrolledPrograms.includes(resource.program.toString())) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You must be enrolled in the required program to access this resource.'
        });
      }
    }

    // Increment views
    resource.views += 1;
    await resource.save();

    res.json({
      success: true,
      data: { resource }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resource',
      error: error.message
    });
  }
};

// Get featured resources
export const getFeaturedResources = async (req, res) => {
  try {
    const resources = await Resource.find({
      isPublished: true,
      isFeatured: true
    })
      .limit(6)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { resources }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured resources',
      error: error.message
    });
  }
};

// Get resources by category
export const getResourcesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 12 } = req.query;

    const resources = await Resource.find({
      isPublished: true,
      category
    })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Resource.countDocuments({
      isPublished: true,
      category
    });

    res.json({
      success: true,
      data: {
        resources,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resources',
      error: error.message
    });
  }
};

// Create resource (admin only)
export const createResource = async (req, res) => {
  try {
    const resourceData = {
      ...req.body,
      author: req.user.id
    };

    const resource = await Resource.create(resourceData);

    res.status(201).json({
      success: true,
      message: 'Resource created successfully',
      data: { resource }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to create resource',
      error: error.message
    });
  }
};

// Update resource (admin only)
export const updateResource = async (req, res) => {
  try {
    const oldResource = await Resource.findById(req.params.id);
    
    if (!oldResource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    // If new media is provided, delete the old one from Cloudinary
    if (req.body.mediaPublicId && oldResource.mediaPublicId && req.body.mediaPublicId !== oldResource.mediaPublicId) {
      const resourceType = oldResource.type === 'pdfs' || oldResource.mediaUrl?.endsWith('.pdf') ? 'raw' : 'image';
      await cloudinary.uploader.destroy(oldResource.mediaPublicId, { resource_type: resourceType });
    }

    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Resource updated successfully',
      data: { resource }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update resource',
      error: error.message
    });
  }
};

// Delete resource (admin only)
export const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    // Delete from Cloudinary if exists
    if (resource.mediaPublicId) {
      // Determine resource type (raw for pdfs, image for images)
      const resourceType = resource.type === 'pdfs' || resource.mediaUrl?.endsWith('.pdf') ? 'raw' : 'image';
      await cloudinary.uploader.destroy(resource.mediaPublicId, { resource_type: resourceType });
    }

    await Resource.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Resource deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete resource',
      error: error.message
    });
  }
};

// Like resource
export const likeResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    res.json({
      success: true,
      data: { likes: resource.likes }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to like resource',
      error: error.message
    });
  }
};

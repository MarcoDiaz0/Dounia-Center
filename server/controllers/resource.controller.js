import Resource from '../models/Resource.model.js';

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
      page = 1, 
      limit = 12 
    } = req.query;

    const query = { isPublished: true };
    
    if (type) query.type = type;
    if (category) query.category = category;
    if (featured === 'true') query.isFeatured = true;
    
    if (ageMin || ageMax) {
      query['ageRange.min'] = { $lte: parseInt(ageMax) || 18 };
      query['ageRange.max'] = { $gte: parseInt(ageMin) || 0 };
    }

    if (search) {
      query.$text = { $search: search };
    }

    const resources = await Resource.find(query)
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

// Create resource (admin/specialist only)
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

// Update resource (admin/specialist only)
export const updateResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

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
    const resource = await Resource.findByIdAndDelete(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

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

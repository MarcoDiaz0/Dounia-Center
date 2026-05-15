import { instance } from './api';

const resourceService = {
  // Get all resources with optional filters
  getResources: async (params) => {
    const { data } = await instance.get('/resources', { params });
    return data;
  },

  // Get featured resources
  getFeaturedResources: async () => {
    const { data } = await instance.get('/resources/featured');
    return data;
  },

  // Create a new resource (requires auth)
  createResource: async (resourceData) => {
    const { data } = await instance.post('/resources', resourceData);
    return data;
  },

  // Update a resource (requires auth)
  updateResource: async (id, resourceData) => {
    const { data } = await instance.put(`/resources/${id}`, resourceData);
    return data;
  },

  // Delete a resource (requires auth)
  deleteResource: async (id) => {
    const { data } = await instance.delete(`/resources/${id}`);
    return data;
  },

  // Upload a file to Cloudinary (requires auth)
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const { data } = await instance.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
};

export default resourceService;

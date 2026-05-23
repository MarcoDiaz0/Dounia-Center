import { instance } from "./api";

const resourceService = {
  // Get all resources with optional filters
  getResources: async (params) => {
    const { data } = await instance.get("/resources", { params });
    return data;
  },

  // Get featured resources
  getFeaturedResources: async () => {
    const { data } = await instance.get("/resources/featured");
    return data;
  },

  // Create a new resource (requires auth)
  createResource: async (resourceData) => {
    const { data } = await instance.post("/resources", resourceData);
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

  // Upload a file directly to Cloudinary using a server-generated signature
  uploadFile: async (file) => {
    const { data: signatureResponse } =
      await instance.post("/upload/signature");
    const { cloudName, apiKey, folder, public_id, timestamp, signature } =
      signatureResponse.data;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("folder", folder);
    formData.append("public_id", public_id);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.error?.message || "Cloudinary upload failed");
    }

    return {
      success: true,
      message: "File uploaded successfully",
      data: {
        url: result.secure_url,
        public_id: result.public_id,
        mimetype: file.type,
        size: file.size,
      },
    };
  },
};

export default resourceService;

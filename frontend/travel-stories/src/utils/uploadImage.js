import axiosInstance from "./axiosInstance";

const uploadImage = async (imageFile) => {
  const formData = new FormData();
  // Append the image file to the form data
  formData.append("image", imageFile);

  try {
    // Send a POST request to the image upload endpoint
    const response = await axiosInstance.post("/add-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Set header for file upload
      },
    });
    // Return the response data
    return response.data;
  } catch (error) {
    console.error("Error uploading the image:", error);
    // Rethrow the error for the caller to handle
    throw error;
  }
};

export default uploadImage;

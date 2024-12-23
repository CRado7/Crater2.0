import React, { useState } from "react";
import axios from "axios";
import "../styles/CloudinaryUploader.css"; // Import a separate CSS file for styling

const CloudinaryUploader = ({ onUploadComplete, uploadPreset, cloudName, folderPath }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState([]);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    setIsUploading(true);

    try {
      const urls = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", uploadPreset);

          if (folderPath) {
            formData.append("folder", folderPath);
          }

          const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            formData
          );
          return response.data.secure_url;
        })
      );

      setUploadedUrls((prev) => [...prev, ...urls]);
      onUploadComplete([...uploadedUrls, ...urls]); // Notify parent with updated URLs
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeletePhoto = (index) => {
    const updatedUrls = [...uploadedUrls];
    updatedUrls.splice(index, 1); // Remove the photo at the specified index
    setUploadedUrls(updatedUrls);
    onUploadComplete(updatedUrls); // Notify parent with updated URLs
  };

  return (
    <div>
      <input type="file" multiple accept="image/*" onChange={handleFileUpload} />
      {isUploading && <p>Uploading images...</p>}
      <div className="previews">
        {uploadedUrls.map((url, index) => (
          <div key={index} className="preview-item">
            <button
              type="button"
              className="uploader-delete-button"
              onClick={() => handleDeletePhoto(index)}
            >
              &times;
            </button>
            <img src={url} alt={`Uploaded ${index}`} className="preview-image" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CloudinaryUploader;

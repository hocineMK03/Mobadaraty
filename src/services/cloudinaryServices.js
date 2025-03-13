// cloudinaryServices.js
const cloudinary = require("../config/cloudinaryConfig");
const multer = require("multer");

class CloudinaryServices {
  async uploadStream(file) {
    return new Promise((resolve, reject) => {
      // Upload the file stream to Cloudinary
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto", // Automatically detect the file type (PDF, image, etc.)
          folder: "Mobadarat", // The folder where you want to store the file in Cloudinary
        },
        (error, result) => {
          if (error) {
            return reject(error); // Reject if there's an error
          }
          resolve(result); // Resolve with the result if successful
        }
      );

      // Ensure that the file buffer is passed to Cloudinary for upload
      uploadStream.end(file.buffer);
    });
  }



async deleteFile(publicId) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      });
    });
  }
  
}

module.exports = new CloudinaryServices();

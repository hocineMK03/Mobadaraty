const cloudinary = require('cloudinary').v2;
const config = require("./config")
cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  secure: true,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
});


module.exports = cloudinary;

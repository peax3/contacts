const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const dotenv = require("dotenv");

dotenv.config(); // environment variables return undefined without this

cloudinary.config({
  api_key: process.env.CLOUD_KEY,
  cloud_name: process.env.CLOUD_NAME,
  api_secret: process.env.CLOUD_SECRET,
});

const options = {
  transformation: {
    height: "200",
    width: "200",
    crop: "thumb",
    gravity: "faces",
  },

  allowed_formats: ["png", "jpg"],
  folder: "Keep-contacts",
  overwrite: true,
};

const streamUpload = (buffer, fileName) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

async function uploadImage(file) {
  // check file type - make sure the file is an image
  if (!file.mimetype.startsWith("image")) {
    throw new Error("Please upload an image file");
  }
  // check file size
  if (file.size > 1000000) {
    throw new Error("Please upload an image not more than 1MB");
  }
  return streamUpload(file.buffer, file.name);
}

async function deleteImage(publicId) {
  return cloudinary.api.delete_resources(publicId);
}

module.exports = {
  uploadImage,
  deleteImage,
};

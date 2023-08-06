const cloudinary = require("cloudinary").v2;

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

const handleUpload = async (_id, file) => {
  const res = await cloudinary.uploader.upload(file, {
    folder: "avatars",
    public_id: _id,
    chunk_size: 2000000, // 2 MB
    width: 200,
    height: 200,
    crop: "thumb",
    gravity: "auto",
    faces: true,
    quality: "auto:best",
    overwrite: true,
    use_filename: true,
    resource_type: "image",
  });
  return res;
};

module.exports = handleUpload;

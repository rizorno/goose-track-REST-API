const multer = require("multer");

const { handleUpload } = require("../utils");

const { User } = require("../models/user");

const storage = multer.memoryStorage();

const uploadStor = multer({ storage });

const myUploadMiddleware = uploadStor.single("avatar");

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

const upload = async (req, res) => {
  const { _id } = req.user;

  try {
    await runMiddleware(req, res, myUploadMiddleware);

    const b64 = Buffer.from(req.file.buffer).toString("base64");

    const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    const cldRes = await handleUpload(_id, dataURI);

    const avatarURL = cldRes.secure_url;

    await User.findByIdAndUpdate(_id, { avatarURL });

    res.json({ avatarURL });
  } catch (error) {
    console.log(error);
    res.send({
      message: error.message,
    });
  }
};

module.exports = upload;

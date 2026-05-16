const imageKit = require("@imagekit/nodejs");

const ImageKit = new imageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function uploadImage(buffer) {
  const result = await ImageKit.files.upload({
    file: buffer.toString("base64"),
    fileName: "complaint-image.jpg",
  });
  return result;
}

module.exports = uploadImage;

const cloudinary = require('../config/cloudinaryConfig');

const uploadImage = async (filePath, transformationOptions = {}) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            transformation: transformationOptions
        });
        return result
    } catch (error) {
        throw new Error('Error uploading image to Cloudinary: ' + error.message);
    }
}

module.exports = { uploadImage }
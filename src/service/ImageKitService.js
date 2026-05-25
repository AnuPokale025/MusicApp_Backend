const Imagekit = require('imagekit');

const imagekit = new Imagekit({
    publicKey : process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint : process.env.IMAGEKIT_URL_ENDPOINT
});

async function uploadMusic(file){
    const uploadPayload = file?.buffer ?? file;
    const fileName = file?.originalname ? `${Date.now()}_${file.originalname}` : `music_${Date.now()}.mp3`;

    const result = await imagekit.upload({
        file: uploadPayload,
        fileName,
        folder: "/music"
    });
    return result;
}
async function uploadImage(file){
    const uploadPayload = file?.buffer ?? file;
    const fileName = file?.originalname ? `${Date.now()}_${file.originalname}` : `image_${Date.now()}.jpg`;

    const result = await imagekit.upload({
        file: uploadPayload,
        fileName,
        folder: "/images"
    });
    return result;
}

module.exports= { uploadMusic, uploadImage };
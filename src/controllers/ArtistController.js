const Artist = require("../modals/Artist")
const { uploadImage } = require("../service/ImageKitService")

const getAllArtist = async (req, res) => {
    try {
        const artist = await Artist.find();
        res.status(200).send({
            message: "Fetch all artists",
            data: artist
        });
    } catch (err) {
        return res.status(500).send({ message: " Internal Server Error" })
    }
}

const getArtistBYId = async (req, res) => {
    const { artistId } = req.params;
    try {
        const artist = await Artist.findById(artistId);
        res.status(200).send({
            message: "Fetch arist by id",
            data: artist
        })
    } catch (err) {
        return res.status(500).send({ message: " Internal Server Error" })
    }
}

const addArtist = async (req, res) => {
    const { username, email, name, password, phone } = req.body;
    if (!req.files || !req.files.music || !req.files.image) {
        return res.status(400).send({ message: "Music and image files are required" });
    }
    const imageupload = await uploadImage(req.files.image[0]);
    try {
        const artist = new Artist({
            username,
            email,
            name,
            password,
            phone,
            image: imageupload.url
        })
        const result = await artist.save();
        res.status(201).send({
            message: "Artist added successfully",
            data: result
        });
    } catch (err) {
        return res.status(500).send({ message: "Internal Server Error" });
    }

}

module.exports = { getAllArtist, getArtistBYId, addArtist }
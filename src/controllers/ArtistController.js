const Artist = require("../modals/Artist")
const { uploadImage } = require("../service/ImageKitService")
// const { uploadMusic } = require("../service/MusicKitService")
const bcrypt = require('bcrypt');

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
    try {
        const { username, email, name, password, phone } = req.body;

        // Validate fields
        if (!username || !email || !name || !password || !phone) {
            return res.status(400).send({
                message: "All fields are required"
            });
        }

        // Check files
        if (!req.files || !req.files.image ) {
            return res.status(400).send({
                message: "Image file is required"
            });
        }

        // Upload image
        const imageUpload = await uploadImage(req.files.image[0]);

        // Upload music
        // const musicUpload = await uploadMusic(req.files.music[0]);

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const artist = new Artist({
            username,
            email,
            name,
            password: hashedPassword,
            phone,
            image: imageUpload.url,
            // music: musicUpload.url
        });

        const result = await artist.save();

        res.status(201).send({
            message: "Artist added successfully",
            data: result
        });

    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: "Internal Server Error",
            error: err.message
        });
    }
};

module.exports = { getAllArtist, getArtistBYId, addArtist }
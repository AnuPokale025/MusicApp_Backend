const Admin = require('../modals/Admin');
const Playlist = require('../modals/Playlist');
const Favorite = require('../modals/Favorite');
const Song = require('../modals/Song');
const { uploadImage, uploadMusic } = require('../service/ImageKitService')
//get All Songs
const getAllSong = async (req, res) => {
    try {
        const { adminId } = req.params;

        const filter = {};
        if (adminId) {
            filter.adminId = adminId;
        }

        const result = await Song.find(filter);
        res.status(200).send({
            message: "All Songs",
            data: result
        })

    } catch (error) {
        res.status(500).send({ message: 'Internal Server error' });
    }
};

//get by song id
const getSongById = async (req, res) => {

    try {

        const songId = req.params.songId;

        const song = await Song.findById(songId);

        if (!song) {

            return res.status(404).send({
                message: "Song Not Found"
            });
        }

        res.status(200).send({
            message: "Song fetched successfully",
            data: song
        });

    } catch (error) {

        console.log(error);

        res.status(500).send({
            message: "Internal Server Error"
        });
    }
};


//create Song 

const createSong = async (req, res) => {
    try {
        const adminId = req.params.adminId;
        const { title, artist, album } = req.body;

        if (!title || !artist) {
            return res.status(400).send({ message: "all fields are required" });
        }

        if (!req.files || !req.files.music || !req.files.image) {
            return res.status(400).send({ message: "Music and image files are required" });
        }

        const musicupload = await uploadMusic(req.files.music[0]);
        const imageupload = await uploadImage(req.files.image[0]);
        const song = new Song({
            title,
            artist,
            album,
            adminId: adminId,
            releaseDate: new Date(),
            audio: musicupload.url,
            image: imageupload.url
        })
        const result = await song.save();
        res.status(200).send({
            message: "Song created Successfully",
            data: result
        })

    } catch (error) {
        console.error('createSong error:', error);
        res.status(500).send({ message: 'Internal Server error' });
    }
}

//delete song

const deleteSong = async (req, res) => {
    try {
        const songId = req.params.songId;
        const song = await Song.deleteOne({ _id: songId });
        return res.status(200).send({
            message: "Song deleted successfully",
            data: song
        })
    } catch (error) {
        res.status(500).send({ message: 'Internal Server error' });
    }
}
module.exports = { getAllSong, getSongById, createSong, deleteSong };
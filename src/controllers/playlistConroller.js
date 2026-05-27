const User = require('../modals/User');
const Song = require('../modals/Song');
const Playlist = require('../modals/Playlist');
const Favorite = require('../modals/Favorite');
const {uploadImage} = require ('../service/ImageKitService')

//get all playlists
const getAllPlaylist = async (req, res) => {
    try {
        const playlist = await Playlist.find()
        res.status(200).send({
            message: 'Playlist fetched successfully',
            playlist
        })
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server error' });
    }

}

// getplaylist by id
const getplaylistById = async (req, res) => {
    try {
        const playlistId = req.params.playlistId;
        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            return res.status(400).send({
                message: 'Playlist not found'
            })
        }
        res.send(playlist);

    } catch (error) {
        res.status(500).json({ message: 'Internal Server error' });
    }
}

// create playlist
const createPlaylist = async (req, res) => {
    try {
        const { artistId, userId,id,  songId } = req.params;
        const ownerArtistId = artistId || (id && req.path.includes('/artist/') ? id : undefined);
        const ownerUserId = userId || (id && req.path.includes('/user/') ? id : undefined);
        const {name} = req.body;

        // validation
        if (!name) {
            return res.status(400).send({
                message: "Playlist name is required"
            });
        }

        // only one id allowed
        if ((ownerArtistId && ownerUserId) || (!ownerArtistId && !ownerUserId)) {
            return res.status(400).send({
                message: "Provide either adminId or userId"
            });
        }
        if(!req.files || !req.files.image){
            return res.status(400).send({message: "image feild is required"})
        }

                const imageupload = await uploadImage(req.files.image[0]);

        // playlist object
        const playlistData = {
            name,
            songId : songId,
            image : imageupload.url
        };

        // assign owner
        if (ownerArtistId) {
            playlistData.artistId = ownerArtistId;
        }

        if (ownerUserId) {
            playlistData.userId = ownerUserId;
        }


        // save playlist
        const playlist = new Playlist(playlistData);

        const result = await playlist.save();

        return res.status(201).send({
            success: true,
            message: "Playlist created successfully",
            data: result
        });

    } catch (error) {

        return res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });

    }
};

const getPlaylistsByOwner = async (req, res) => {
    try {
        const { artistId, userId } = req.params;

        if (!artistId && !userId) {
            return res.status(400).send({
                message: 'Provide either artistId or userId'
            });
        }

        const filter = {};
        if (artistId) filter.artistId = artistId;
        if (userId) filter.userId = userId;

        const playlists = await Playlist.find(filter);

        return res.status(200).send({
            success: true,
            message: 'Playlists fetched successfully',
            playlists
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

//delete playlist
const deletePlaylist = async (req, res) => {
    try {
        const playlistId = req.params.playlistId;

        const playlist = await Playlist.deleteOne({ _id: playlistId });

        return res.status(200).send({
            message: "Playlist is deleted",
            data: playlist
        })

    } catch (error) {
        res.status(500).send({ message: 'Internal Server error' });
    }
}

module.exports = { getAllPlaylist, getplaylistById, getPlaylistsByOwner, createPlaylist, deletePlaylist }
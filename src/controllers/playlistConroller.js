const User = require('../modals/User');
const Song = require('../modals/Song');
const Playlist = require('../modals/Playlist');
const Favorite = require('../modals/Favorite');


//get all playlists
const getAllPlaylist = async (req, res) => {
    try {
        const playlist = await Playlist.find();
        res.status(200).send({
            message: 'Playlist fetched successfully',
            data: playlist
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

const createPlaylist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, songs } = req.body;

        let playlist = new Playlist({
            name,
            userId,
            songs: songs || [],
        });

        await playlist.save();

        playlist = await Playlist.findById(playlist._id)
            .populate("songs", "title artist audio, image");

        res.status(201).json({
            success: true,
            data: playlist,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
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
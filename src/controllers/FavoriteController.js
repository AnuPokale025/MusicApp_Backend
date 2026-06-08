const User = require('../modals/User');
const Song = require('../modals/Song');
const Playlist = require('../modals/Playlist');
const Favorite = require('../modals/Favorite');

// getAll favrorite

const getAllFavorite = async (req, res) => {

    try {

        // Only return favorites for the authenticated user
        const loggedInUserId = req.user && req.user.id;
        if (!loggedInUserId) {
            return res.status(401).send({ message: 'Unauthorized' });
        }

        // allow optional filtering by songId or playlistId via query params
        const { playlistId, songId } = req.query || {};
        const filter = { userId: loggedInUserId };
        if (playlistId) filter.playlistId = playlistId;
        if (songId) filter.songId = songId;

        const favorites = await Favorite.find(filter)
            .populate('playlistId', 'name')
            .populate('songId', 'title artist image audio releaseDate');

        res.status(200).send({
            message: 'Favorites fetched successfully',
            data: favorites
        });
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' });
    }
}

// add to favorite
const addtoFavorite = async (req, res) => {
    // console.log("Params:", req.params);
    try {
        const io = req.app.get("io");
        // Use authenticated user id rather than trusting client-provided userId
        const loggedInUserId = req.user && req.user.id;
        const { songId } = req.params;

        if (!loggedInUserId || !songId) {
            return res.status(400).send({ message: "all fields are required" });
        }

        const favorite = new Favorite({ userId: loggedInUserId, songId: songId });
        const result = await favorite.save();
        // await (await result.populate('songId')).populate('playlistId')
        io.emit("newfavoriteSong", result);
        res.status(200).send({
            message: "Added to favorite succelfully",
            data: result
        })
    } catch (error) {
        res.status(500).send({ message: "Internal server error" })
    }
}
const removeFromFavorite = async (req, res) => {
    try {
        const { favoriteId } = req.params;

        const loggedInUserId = req.user && req.user.id;
        if (!loggedInUserId) {
            return res.status(401).send({ message: 'Unauthorized' });
        }

        const favorite = await Favorite.findById(favoriteId);
        if (!favorite) {
            return res.status(404).send({ message: 'Favorite not found' });
        }

        if (favorite.userId.toString() !== loggedInUserId.toString()) {
            return res.status(403).send({ message: 'Forbidden: cannot remove another user\'s favorite' });
        }

        await Favorite.deleteOne({ _id: favoriteId });
        return res.status(200).send({ message: "Removed from Favorite successfully" });
    } catch (error) {
        res.status(500).send({ message: "Internal server error" })
    }
}

module.exports = {
    getAllFavorite,
    addtoFavorite,
    removeFromFavorite
}
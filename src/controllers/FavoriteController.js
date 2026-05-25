const User = require('../modals/User');
const Song = require('../modals/Song');
const Playlist = require('../modals/Playlist');
const Favorite = require('../modals/Favorite');

// getAll favrorite

const getAllFavorite =async(req, res)=> {

try{
     const {userId, playlistId, songId} = req.params;
        const filter = {};  
        if (userId) {
            filter.userId = userId;
        }   
        if (playlistId) {
            filter.playlistId = playlistId;
        }
        if (songId) {       
            filter.songId = songId;
        }

        const favorites = await Favorite.find(filter);

        res.status(200).send({
            message: 'Favorites fetched successfully',
            data : favorites
        });
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' });
    }
}

// add to favorite
const addtoFavorite = async(req, res)=>{
    try{
        const {userId, playlistId, songId} = req.params;

        if(!userId , !playlistId, !songId){
            return res.status(400).send({message : "all fields are required"});
        }

        const favorite = new Favorite({
            userid: userId,
            playlistId : playlistId,
            songId : songId
        })
        const result = await favorite.save();
        res.status(200).send({
            message : "Added to favorite succelfully",
            data : result
        })
    }catch(error){
        res.status(500).send({message: "Internal server error"})
    }
}
const removeFromFavorite = async (req, res)=>{
    try{
        const {favoriteId} = req.params;

        const favorite = await Favorite.deleteOne({_id: favoriteId});
        return res.status(200).send({
            message : "Removed from Favorite successfully",
            data : favorite
        })
    }catch(error){
        res.status(500).send({message: "Internal server error"})
    }
}

module.exports = {
    getAllFavorite,
    addtoFavorite,
    removeFromFavorite
}
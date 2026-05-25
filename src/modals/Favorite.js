const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    playlistId:{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Playlist'
    },
    songId :{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Song'
    },
});

module.exports = mongoose.model('Favorite', favoriteSchema);
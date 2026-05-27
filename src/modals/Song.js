const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    album: {
        type: String,
    },
    duration: {
        type: Number,
    },  
    releaseDate: {
        type: Date,
    },
    image: {
        type: String,
    },
    audio:{
        type: String,
    },
    artistId:{
    type : mongoose.Schema.Types.ObjectId,
    ref: 'Artist'
    }
   
});

module.exports = mongoose.model('Song', songSchema);

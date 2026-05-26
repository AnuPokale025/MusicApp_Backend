const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  songid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song'
  },
    userId: {  
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  adminId:{
    type : mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
});    

module.exports =
    mongoose.models.Playlist ||
    mongoose.model("Playlist", playlistSchema);
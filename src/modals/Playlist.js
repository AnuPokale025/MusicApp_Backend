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
  artistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist'
  },
  image: {
    type: String,
  }
});

module.exports =
  mongoose.models.Playlist ||
  mongoose.model("Playlist", playlistSchema);
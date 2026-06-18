const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  songs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song'
  },
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }

});

module.exports = mongoose.model("Playlist", playlistSchema);
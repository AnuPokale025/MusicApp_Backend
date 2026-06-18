const mongoose = require('mongoose');
const User = require('../modals/User');

const WatchingHistorySchema = new mongoose.Schema({
    userId: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    songId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song'
    },
    playedAt: {
      type : Date,
       default: Date.now()
    }
})

module.exports = mongoose.model('WatchHistory',WatchingHistorySchema )


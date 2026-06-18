const { populate } = require('../modals/Song');
const WatchingHistory = require('../modals/WatchingHistory');


const getHistory = async (req, res) => {

    try {
        const { userId } = req.params;

        const history = await WatchingHistory.find({ userId })
            .populate('songId')
            .sort({ playedAt: -1 })

        res.status(200).send({
            message: "History",
            data: history
        })
    } catch (err) {
        res.status(500).send({
            message: "Internal Error", err
        })

    }
}
const addHistory = async (req, res) => {
    try {
        const { userId, songId } = req.params;

        const history = new WatchingHistory({
            userId,
            songId,
        });

        let result = await history.save();

        result = await result.populate(
            "songId",
            "title album audio image"
        );

        result = await result.populate("userId");

        res.status(200).json({
            message: "Added to history",
            data: result,
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            err,
        });
    }
};

const deleteHistory = async (req, res) => {

    try {
        const { userId } = req.params;

        const history = await WatchingHistory.deleteMany({ userId });

        res.status(200).send({
            message: "History is cleared",
            data: history
        })
    } catch (err) {
        res.status(500).send({
            message: "Inetrnal Server Error", err
        })
    }
}

module.exports = { getHistory, addHistory, deleteHistory }
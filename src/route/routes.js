const LoginController = require('../auth/LoginController');
const RegisterController = require('../auth/RegisterController');
const FavoriteController = require('../controllers/FavoriteController');
const PlaylistController = require('../controllers/playlistConroller');
const SongController = require('../controllers/SongController');
const ForgetPasswordController = require("../auth/ForgetPasswordController");
const ResetPasswordController = require("../auth/ResetPasswordController");
const ArtistController = require("../controllers/ArtistController")
const WatchingHistoryController = require('../controllers/WatchingHistoryController')
const User = require('../modals/User');
const express = require('express');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();
const verifytoken = require('../auth/VerifyToken')


///Auth routes
router.post('/register', RegisterController.register);
router.post('/login', LoginController.login);
router.post('/forget', ForgetPasswordController.forget);
router.post('/reset', ResetPasswordController.reset)

//Artist routes
router.get('/artists', ArtistController.getAllArtist);
router.get('/artists/:artistId', ArtistController.getArtistBYId);
router.post('/artists', upload.fields([
    { name: 'image', maxCount: 1 }
]), ArtistController.addArtist);


// favorite routes
router.get('/favorites', verifytoken, FavoriteController.getAllFavorite);
router.post('/favorites/:userId/:songId', verifytoken, FavoriteController.addtoFavorite);
router.delete('/favorites/:favoriteId', verifytoken, FavoriteController.removeFromFavorite);


//playlist routes
router.get('/playlists', verifytoken, PlaylistController.getAllPlaylist);
router.get('/playlists/:playlistId', verifytoken, PlaylistController.getplaylistById);
router.get('/playlists/artist/:artistId', verifytoken, PlaylistController.getPlaylistsByOwner);
router.get('/playlists/user/:userId', verifytoken, PlaylistController.getPlaylistsByOwner);
// router.post('/playlists/artist/:artistId',verifytoken, upload.fields([
//     { name: 'image', maxCount: 1 }
// ]), PlaylistController.createPlaylist);
// router.post('/playlists/user/:userId',verifytoken, upload.fields([
//     { name: 'image', maxCount: 1 }
// ]), PlaylistController.createPlaylist);
router.post('/playlists/:userId/:songId', verifytoken, PlaylistController.createPlaylist)
router.delete('/playlists/:playlistId', verifytoken, PlaylistController.deletePlaylist);


//song routes
router.get('/song', SongController.getAllSong);
router.get('/song/:songId', SongController.getSongById);
router.post('/song/:aristId', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'music', maxCount: 1 }
]), SongController.createSong);
router.delete('/song/:songId', SongController.deleteSong);
router.get('/search', SongController.searchSong)

//WtachHistory

router.get('/history/:userId', verifytoken, WatchingHistoryController.getHistory);
router.post('/history/:userId/:songId', verifytoken, WatchingHistoryController.addHistory);
router.delete('/history/:userId', verifytoken, WatchingHistoryController.deleteHistory)

module.exports = router;
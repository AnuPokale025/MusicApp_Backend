const LoginController = require('../auth/LoginController');
const RegisterController = require('../auth/RegisterController');
const FavoriteController = require('../controllers/FavoriteController');
const PlaylistController = require('../controllers/playlistConroller');
const SongController = require('../controllers/SongController');
const User = require('../modals/User');
const express = require('express');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();


///Auth routes
router.post('/register', RegisterController.register);
router.post('/login', LoginController.login);

// favorite routes
router.get('/favorites', FavoriteController.getAllFavorite);
router.post('/favorites/:userId/:playlistId/:songId', FavoriteController.addtoFavorite);
router.delete('/favorites/:favoriteId', FavoriteController.removeFromFavorite);


//playlist routes
router.get('/playlists', PlaylistController.getAllPlaylist);
router.get('/playlists/:playlistId', PlaylistController.getplaylistById);
router.get('/playlists/admin/:adminId', PlaylistController.getPlaylistsByOwner);
router.get('/playlists/user/:userId', PlaylistController.getPlaylistsByOwner);
router.post('/playlists/admin/:adminId', PlaylistController.createPlaylist);
router.post('/playlists/user/:userId', PlaylistController.createPlaylist);
router.delete('/playlists/:playlistId', PlaylistController.deletePlaylist);


//song routes
router.get('/song', SongController.getAllSong);
router.get('/song/:songId', SongController.getSongById);
router.post('/song/:adminId', upload.fields([
    { name: 'music', maxCount: 1 },
    { name: 'image', maxCount: 1 }
]), SongController.createSong);
router.delete('/song/:songId', SongController.deleteSong);



module.exports = router;
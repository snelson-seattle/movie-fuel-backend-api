const express = require('express');
const bodyParser = require('body-parser');
const userService = require('../service/userService');
const router = express.Router();

router.use(bodyParser.json());

// GET user profile by username
router.get('/profile/:username', async (req, res) => {
    const username = req.params.username;

    try {
        const userInfo = await userService.getProfile(username);

        if (userInfo) {
            res.status(200).json(userInfo);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        console.error(err);

        res.status(500).json({ message: 'Internal server error' });
    }
});
router.patch('/profile/Favorites/:username/', async (req, res) => {
    const username = req.params.username;
    const movieIds = req.body.favorites;


    try {
        const userInfo = await userService.updateFavorites(username, movieIds);

        if (userInfo) {
            res.status(200);
            res.send({
                message: "added movie successfully",
                info: userInfo
            });
        } else {
            res.status(404);
            res.send({
                message: "didn't add movie successfully"
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.put('/profile/About/:username/', async (req, res) => {
    const username = req.params.username;
    const about = req.body.about;


    try {
        const userInfo = await userService.updateAbout(username, about);

        if (userInfo) {
            res.status(200);
            res.send({
                message: "update about me successfully",
                info: userInfo
            });
        } else {
            res.status(404);
            res.send({
                message: "didn't update about me"
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});
module.exports = router;

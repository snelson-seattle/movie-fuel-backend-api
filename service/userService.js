const userDao = require('../dao/userDAO');

async function getProfile(username) {
    // calls the dao to check login

    const userData = await userDao.getUser(username);



    return userData.Item;

}
async function updateFavorites(username, favorites) {
    // calls the dao to check login
    try {
        const userData = await userDao.addToFavorites(username, favorites);
        return 1;
    } catch (err) {
        console.error(err);
    }





}
async function updateAbout(username, about) {
    // calls the dao to check login
    try {
        const userData = await userDao.updateAbout(username, about);
        return 1;
    } catch (err) {
        console.error(err);
    }





}
module.exports = {
    getProfile,
    updateFavorites,
    updateAbout
}
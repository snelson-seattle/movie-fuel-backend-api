const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const logger = require('../utils/logger');
const reviewService = require('../service/reviewService');
const reviewDAO = require('../dao/reviewDAO');
const likeDAO = require('../dao/likeDAO');
const verifyJWT = require('../middleware/verifyJWT');

// This adds post to reviews resource

router.post('/', verifyJWT, async (req, res) => {
  const body = req.body;
  // Test review
  const validateReview = reviewService.validateReview(req);
  if (!validateReview.valid) {
    logger.error(`Can't post because ${validateReview.invalidMessage}`);
    res.status(400).send(`Can't post because ${validateReview.invalidMessage}`);
    return;
  }
  const postID = uuid.v4();
  const dateTime = new Date().toISOString();
  try {
    const dataReview = await reviewDAO.addReview(
      postID,
      req.username,
      body.Title,
      body.Movie,
      body.Comment,
      dateTime
    );
    // if valid then data is simply {}
    const newReview = { ...body, dateTime, postID };
    logger.info(`Successful Review POST:\n ${JSON.stringify(newReview)}`);
    res.status(201).send({
      message: 'Successfully created Review',
      data: newReview,
    });
  } catch (err) {
    logger.info(`Failed to add ticket to dynamoDB: ${err}`);
    res.status(500).send({ message: 'Failed to add review to database' });
  }
});
// Gets all reviews resource
router.get('/', async (req, res) => {
  try {
    const getAllData = await reviewDAO.getAllReviews();
    logger.info(
      `Successful GET from dynamoDB ${JSON.stringify(getAllData.Items)}`
    );
    res
      .status(200)
      .send({ message: 'Successful GET from dynamoDB', data: getAllData });
  } catch (err) {
    logger.info(`Failed to get from dynamoDB: ${err}`);
    res.status(500).send({ message: `Failed to get from dynamoDB: ${err}` });
  }
});

// gets revies by postID resource
// Shouldn't need to validate user for this
router.get('/:PostID', async (req, res) => {
  const PostID = req.params.PostID;
  try {
    const getIDData = await reviewDAO.getReview(PostID);
    logger.info(
      `Successful GET from dynamoDB ${JSON.stringify(getIDData.Items)}`
    );
    res
      .status(200)
      .send({ message: 'Successful GET from dynamoDB', data: getIDData });
  } catch (err) {
    logger.info(`Failed to get from dynamoDB: ${err}`);
    res.status(500).send({ message: `Failed to get from dynamoDB: ${err}` });
  }
});
// TODO MIDDLEWARE TO ADD USER TO MAKE SURE YOU CAN REFERENCE IT TO POST, FOR NOW SEND THRU BODY
router.post('/:PostID/likes', async (req, res) => {
  const PostID = req.params.PostID;
  // Check to see if they have a valid post
  try {
    const postIDData = await reviewDAO.getReview(PostID);
    logger.info(
      `Successful GET from dynamoDB ${JSON.stringify(postIDData.Items)}`
    );
    if (postIDData.Items.length != 1) {
      logger.error('PostID not found in DynamoDB');
      res.status(400).send('PostID not found in DynamoDB');
    } else {
      // Const PostLikes = postIDData.Items[0].likes;
      // Means found valid post, so now check to see if we already have a like
      // TODO FINISH THIS WITH USER
      const getLikeData = await likeDAO.getLike();
      // if !getLikeData.Items.length
      //  Then means we can create a like item in our like table
      //  also means we can update likes in our post table
      // else means we already have like
      //  This means we delete our like from the table
      //  Also means we need to update likes in our post table
    }
  } catch (err) {
    logger.info(`Failed to get from dynamoDB: ${err}`);
    res.status(500).send({ message: `Failed to get from dynamoDB: ${err}` });
  }
});

module.exports = router;

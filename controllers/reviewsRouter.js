const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const logger = require('../utils/logger');
const reviewService = require('../service/reviewService');
const reviewDAO = require('../dao/reviewDAO');

// This adds post to reviews resource
// TODO MiddleWare to validate user
router.post('/', async (req, res) => {
  const body = req.body;
  // Test review
  const validateReview = reviewService.validateReview(req);
  if (!validateReview.valid) {
    logger.error(`Can't post because ${validateReview.invalidMessage}`);
    res.status(400).send(`Can't post because ${validateReview.invalidMessage}`);
    return;
  }
  const postID = uuid.v4();
  const dateTime = new Date().toString();
  try {
    const dataReview = await reviewDAO.addReview(
      postID,
      body.Author,
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

module.exports = router;

const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const logger = require('../utils/logger');
const verifyJWT = require('../middleware/verifyJWT');
const commentService = require('../service/commentsService');
const commentDAO = require('../dao/commentDAO');

router.post('/', verifyJWT, async (req, res) => {
  const username = req.username;
  const body = req.body;
  const validateComment = commentService.validateComment(req);
  if (!validateComment.valid) {
    logger.error(`Can't post because ${validateComment.invalidMessage}`);
    res
      .status(400)
      .send(`Can't post because ${validateComment.invalidMessage}`);
    return;
  }
  const replyID = uuid.v4();
  const dateTime = new Date().toISOString();
  const postID = body.PostID;
  const comment = body.Comment;

  try {
    const dataComment = await commentDAO.addComment(
      replyID,
      postID,
      username,
      comment,
      dateTime,
      body?.ReplyToID
    );
    const newComment = {
      ReplyID: replyID,
      PostID: postID,
      Author: username,
      Comment: comment,
      DateTime: dateTime,
      ReplyToID: body?.ReplyToID,
      Likes: 0,
    };
    logger.info(`Successful Comment POST:\n ${JSON.stringify(newComment)}`);
    res.status(201).send({
      message: 'Successfully created Comment',
      data: newComment,
    });
  } catch (err) {
    logger.info(`Failed to add comment to dynamoDB: ${err}`);
    res.status(500).send({ message: 'Failed to add comment to database' });
  }
});

router.get('/:PostID', async (req, res) => {
  const PostID = req.params.PostID;
  try {
    const data = await commentDAO.getComments(PostID);
    logger.info(`Successful Comment GET:\n ${JSON.stringify(data)}`);
    res.status(200).send({
      message: 'Successfully retrieved comments',
      data: data.Items,
    });
  } catch (err) {
    logger.info(`Failed to get comments from dynamoDB: ${err}`);
    res.status(500).send({ message: 'Failed to get comments from database' });
  }
});

router.get('/comment/:ReplyID', async (req, res) => {
  const ReplyID = req.params.ReplyID;
  try {
    const data = await commentDAO.getComment(ReplyID);
    logger.info(`Successful Comment GET:\n ${JSON.stringify(data)}`);
    res.status(200).send({
      message: 'Successfully retrieved comment',
      data: data.Items,
    });
  } catch (err) {
    logger.info(`Failed to get comment from dynamoDB: ${err}`);
    res.status(500).send({ message: 'Failed to get comment from database' });
  }
});

module.exports = router;

const logger = require('../utils/logger');

function validateComment(req) {
  logger.info('Attempting to post comment');
  const body = req.body;
  const validComment = {};
  const invalidMessages = [];
  //input validation
  if (!body.Comment || body.Comment === '') {
    invalidMessages.push('No Comment attribute, or empty Comment value');
  }
  if (!body.PostID || body.PostID === '') {
    invalidMessages.push('No PostID attribute, or empty PostID value');
  }
  if (invalidMessages.length > 0) {
    validComment.invalidMessage = `${invalidMessages.join(', and ')}`;
    logger.error(`Couldn't post because ${validComment.invalidMessage}`);
    validComment.valid = false;
  } else {
    validComment.valid = true;
  }
  return validComment;
}

module.exports = { validateComment };

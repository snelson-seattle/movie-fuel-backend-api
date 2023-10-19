const logger = require('../utils/logger');

/**
 * Given request in body
 * Returns a validReview object that verifys that the review given is valid
 * @param {Request} req from client
 */
function validateReview(req) {
  logger.debug('Attempting to post review');
  const validReview = {};
  const body = req.body;
  const invalidMessages = [];

  // Input validation
  if (!body.Author || body.Author === '') {
    invalidMessages.push('No attribute Author, or empty Attribute Value');
  }
  if (!body.Title || body.Title === '') {
    invalidMessages.push('No Title attribute, or empty Title value');
  }
  if (!body.Movie || body.Movie === '') {
    invalidMessages.push('No Movie attribute, or empty Movie value');
  }
  if (!body.Comment || body.Comment === '') {
    invalidMessages.push('No Comment attribute, or empty Comment');
  }

  if (invalidMessages.length > 0) {
    validReview.invalidMessage = `${invalidMessages.join(', and ')}`;
    logger.error(`Couldn\'t post because ${validReview.invalidMessage}`);
    validReview.valid = false;
  } else {
    validReview.valid = true;
  }
  return validReview;
}

module.exports = { validateReview };

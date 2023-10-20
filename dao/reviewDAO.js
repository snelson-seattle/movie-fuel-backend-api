const AWS = require('aws-sdk');
AWS.config.update({
  region: 'us-west-2',
});

// Interface to DynamoDB
const docClient = new AWS.DynamoDB.DocumentClient();
// This is table name in dynamoDB
const TableName = 'MovieFuel-Reviews';
/**
 *
 * @param {String} PostID - string param
 * @param {String} Author - string param
 * @param {String} Title - string param
 * @param {String} Movie - string param
 * @param {String} Comment - string param
 * @param {String} DateTime - string param
 * @returns {Object} empty object if post succeeded
 */
function addReview(PostID, Author, Title, Movie, Comment, DateTime) {
  const params = {
    TableName,
    Item: {
      PostID,
      Author,
      Title,
      Movie,
      Comment,
      DateTime,
    },
  };
  docClient.put(params).promise();
}

module.exports = { addReview };

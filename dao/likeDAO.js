const AWS = require('aws-sdk');
AWS.config.update({
  region: 'us-west-2',
});

// Interface to DynamoDB
const docClient = new AWS.DynamoDB.DocumentClient();
// This is table name in dynamoDB
const LikesTable = 'MovieFuel-Likes';

/**
 *
 * @param {String} contentID - string param
 * @param {String} UserName - string param
 */
function postLike(ContentID, UserName) {
  const params = {
    TableName: LikesTable,
    Item: {
      ContentID,
      UserName,
    },
  };
  return docClient.put(params).promise();
}

function deleteLike(ContentID, UserName) {
  const params = {
    TableName: LikesTable,
    Key: {
      ContentID,
      UserName,
    },
  };
  return docClient.delete(params).promise();
}

function getLike(ContentID, UserName) {
  const params = {
    TableName: LikesTable,
    Key: {
      ContentID,
      UserName,
    },
  };
  return docClient.get(params).promise();
}

module.exports = { postLike, deleteLike, getLike };

const AWS = require('aws-sdk');
require('dotenv').config()
AWS.config.update({
  region: "us-west-2",
});

// Interface to DynamoDB
const docClient = new AWS.DynamoDB.DocumentClient();
// This is table name in dynamoDB
const repliesTable = 'MovieFuel-Replies';
// GSI for getting all replies for a specific post
const PostID_Index = 'PostID-index';
// GSI for getting a specific reply
const ReplyID_Index = 'ReplyID-index';

function addComment(
  ReplyID,
  PostID,
  Author,
  Comment,
  DateTime,
  ReplyToID = undefined
) {
  const params = {
    TableName: repliesTable,
    Item: {
      ReplyID,
      PostID,
      Author,
      Comment,
      DateTime,
      ReplyToID,
      Likes: 0,
    },
  };
  return docClient.put(params).promise();
}

function getComments(PostID) {
  const params = {
    TableName: repliesTable,
    IndexName: PostID_Index,
    KeyConditionExpression: '#PostID = :PostID',
    ExpressionAttributeNames: {
      '#PostID': 'PostID',
    },
    ExpressionAttributeValues: {
      ':PostID': PostID,
    },
  };
  return docClient.query(params).promise();
}

function getComment(ReplyID) {
  const params = {
    TableName: repliesTable,
    IndexName: ReplyID_Index,
    KeyConditionExpression: '#ReplyID = :ReplyID',
    ExpressionAttributeNames: {
      '#ReplyID': 'ReplyID',
    },
    ExpressionAttributeValues: {
      ':ReplyID': ReplyID,
    },
  };
  return docClient.query(params).promise();
}
module.exports = { addComment, getComments, getComment };

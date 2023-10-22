const AWS = require('aws-sdk');
AWS.config.update({
  region: "us-west-2",
});

const docClient = new AWS.DynamoDB.DocumentClient();
const TableName = 'MovieFuel-Users';

function addToFavorites(username, favorites) {
  const params = {
    TableName,
    Key: {
      username,
    },
  };

  return docClient
    .get(params)
    .promise()
    .then((data) => {
      // data.Item.favorites.push(id);
      const updateParams = {
        TableName,
        Key: {
          username,
        },
        UpdateExpression: 'SET favorites = :newFavorites',
        ExpressionAttributeValues: {
          ':newFavorites': favorites,
        },
      };

      docClient.update(updateParams).promise();
    })
    .catch((err) => {
      console.error(err);
    });
}

function addUser(user) {
  const params = {
    TableName,
    Item: user,
    ConditionExpression: 'attribute_not_exists(username)',
  };

  return docClient.put(params).promise();
}

function getUser(username) {
  const params = {
    TableName,
    Key: {
      username,
    },
  };

  return docClient.get(params).promise();
}
function updateAbout(username, about) {
  const params = {
    TableName,
    Key: {
      username,
    },
  };

  return docClient
    .get(params)
    .promise()
    .then((data) => {
      const updateParams = {
        TableName,
        Key: {
          username,
        },
        UpdateExpression: 'SET aboutme = :newabout',
        ExpressionAttributeValues: {
          ':newabout': about,
        },
      };

      docClient.update(updateParams).promise();
    })
    .catch((err) => {
      console.error(err);
    });
}
module.exports = {
  addUser,
  getUser,
  addToFavorites,
  updateAbout,
};

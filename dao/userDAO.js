const AWS = require("aws-sdk");
AWS.config.update({
    region: "us-west-2",
});

const docClient = new AWS.DynamoDB.DocumentClient();
const TableName = "MovieFuel-Users";

function addToFavorites(username, id) {

    const params = {
        TableName: 'MovieFuel-Users',
        Key: {
            'UserName': username
        }
    };

    return docClient.get(params).promise()
        .then((data) => {

            data.Item.Favorites.push(id);
            const updateParams = {
                TableName: 'MovieFuel-Users',
                Key: {
                    'UserName': username,
                },
                UpdateExpression: 'SET Favorites = :newFavorites',
                ExpressionAttributeValues: {
                    ':newFavorites': data.Item.Favorites,
                },
            };

            docClient.update(updateParams).promise();
        })
        .catch(err => {
            console.error(err);
        });
}

function addUser(user) {
    const params = {
        TableName,
        Item: user,
        ConditionExpression: "attribute_not_exists(username)",
    };

    return docClient.put(params).promise();
}

function getUser(username) {
    const params = {
        TableName: 'MovieFuel-Users',
        Key: {
            username
        }
    };

    return docClient.get(params).promise();
}

module.exports = {
    addUser,
    getUser,
    addToFavorites
};

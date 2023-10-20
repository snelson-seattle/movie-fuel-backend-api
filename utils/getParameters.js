const AWS = require("aws-sdk");

const ssmClient = new AWS.SSM({
  apiVersion: "2014-11-06",
  region: "us-west-2",
});

async function getAccessTokenSecret() {
  let access_token_secret = await ssmClient
    .getParameter({
      Name: "ACCESS_TOKEN_SECRET",
    })
    .promise();

  return access_token_secret.Parameter.Value;
}

async function getRefreshTokenSecret() {
  let refresh_token_secret = await ssmClient
    .getParameter({
      Name: "REFRESH_TOKEN_SECRET",
    })
    .promise();

  return refresh_token_secret.Parameter.Value;
}

async function getTMDBKey() {
    let tmdb_key = await ssmClient
      .getParameter({
        Name: "TMDB_KEY",
      })
      .promise();
  
    return tmdb_key.Parameter.Value;
  }

module.exports = {
  getAccessTokenSecret,
  getRefreshTokenSecret,
  getTMDBKey,
};

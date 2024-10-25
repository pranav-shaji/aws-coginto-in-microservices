const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const AWS = require('aws-sdk');
//const config = require('./config.js');
require('dotenv').config();

AWS.config.update({
  region: process.env.REGION, // Replace with your AWS region
});

const poolData = {
  UserPoolId:process.env.USER_POOL_ID,
  ClientId:process.env.CLIENT_ID,
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

// Function to sign up a user
function signUpUser(username, password, email) {
  return new Promise((resolve, reject) => {
    const attributeList = [];

    const emailAttribute = {
      Name: 'email',
      Value: email,
    };

    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute(emailAttribute));

    userPool.signUp(username, password, attributeList, null, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

// Function to authenticate a user
function authenticateUser(username, password) {
  return new Promise((resolve, reject) => {
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
      Username: username,
      Password: password,
    });

    const userData = {
      Username: username,
      Pool: userPool,
    };

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        const accessToken = result.getAccessToken().getJwtToken();
        resolve(accessToken);
      },
      onFailure: (err) => {
        reject(err);
      },
    });
  });
}
// Confirm User Function
function confirmUser(username, confirmationCode) {
  return new Promise((resolve, reject) => {
    const userData = {
      Username: username,
      Pool: userPool,
    };

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.confirmRegistration(confirmationCode, true, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}


module.exports = { signUpUser, authenticateUser,confirmUser };

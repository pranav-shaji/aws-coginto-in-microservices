
const express = require('express');
const bodyParser = require('body-parser');
const { signUpUser, authenticateUser,confrimUser } = require('./cognito');  // Import the functions from cognito.js

const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Sign-Up Endpoint
app.post('/signup', (req, res) => {
  const { username, password, email } = req.body;

  signUpUser(username, password, email)
    .then((data) => {
      res.status(200).json({
        message: 'User signed up successfully',
        username: data.user.getUsername(),
      });
    })
    .catch((err) => {
      res.status(400).json({
        error: err.message || JSON.stringify(err),
      });
    });
});

//confirm a user
app.post('/confirm', (req, res) => {
    const { username, confirmationCode } = req.body;
  
    confirmUser(username, confirmationCode)
      .then((data) => {
        res.status(200).json({
          message: 'User confirmed successfully',
          result: data,
        });
      })
      .catch((err) => {
        res.status(400).json({
          error: err.message || JSON.stringify(err),
        });
      });
  });

// Sign-In Endpoint
app.post('/signin', (req, res) => {
  const { username, password } = req.body;

  authenticateUser(username, password)
    .then((token) => {
      res.status(200).json({
        message: 'Authentication successful',
        token: token,  // JWT token
      });
    })
    .catch((err) => {
      res.status(400).json({
        error: err.message || JSON.stringify(err),
      });
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

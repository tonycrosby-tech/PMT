const db = require('../models');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'zBShX-/7DudiuhHdFn>A3JOHVAKJwnQURcyP<&YWDpVFXMj'; // Use a secure key for signing tokens


// const login = async (req, res) => {
//   res.json(req.user);
// };

// exports.login = login;

module.exports = {
  login: (req, res) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (!user) {
        return res
          .status(401)
          .send({ message: 'Login failed. User not found.' });
      }
      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).send(err);
        }

        // Create a token
        const token = jwt.sign(
          { id: user.id, username: user.username },
          JWT_SECRET,
          {
            expiresIn: '1h', // Token expiration time
          }
        );

        // Send the token to the client
        return res.json({ token });
      });
    })(req, res);
  },

  logout: function(req, res) {
    req.logout();
    res.json({ message: 'Logged out successfully' });
  },
};

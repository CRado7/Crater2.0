const jwt = require('jsonwebtoken');
const { GraphQLError } = require('graphql');

const secret = 'mysecretssshhhhhhh';
const expiration = '2h';

module.exports = {
  signToken: function ({ username, _id }) {
    const payload = { username, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
  authMiddleware: function ({ req }) {
    // Allows token to be sent via req.query or headers
    let token = req.headers.authorization;

    if (token) {
      // Remove "Bearer" from the token string
      token = token.split(' ').pop().trim();
    }

    // If there's no token, return req without throwing an error
    if (!token) {
      return req;
    }

    try {
      // Verify the token and attach user data to req if valid
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch (err) {
      console.error('Invalid token:', err);
      // Do not throw an error here; just don't attach user data to req
    }

    // Return the request with the user attached, if verified
    return req;
  },
};

const jwt = require('jsonwebtoken');

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

    if (!token) {
      return req; // No token, no modification to the request
    }

    try {
      // Decode and attach user data to request if valid
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch (err) {
      console.error('Invalid token:', err);
      throw new GraphQLError('Invalid token', {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      });
    }

    // Return the request with the user attached, if verified
    return req;
  },
};

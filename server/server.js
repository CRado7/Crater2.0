const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');
const cors = require('cors');
const { authMiddleware } = require('./utils/auth');
const session = require('express-session');
const cookieParser = require('cookie-parser'); // Import cookie-parser
const { execute } = require('@graphql-tools/executor');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const uuid = require('uuid');
const MongoStore = require('connect-mongo');

const PORT = process.env.PORT || 3001;
const app = express();

// Create an executable schema for GraphQL
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Middleware to ensure a single session ID per visit
const ensureSessionId = (req, res, next) => {
  if (!req.cookies.sessionId) {
    // If no session ID exists, generate one and store it in a cookie
    const newSessionId = uuid.v4();
    res.cookie('sessionId', newSessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
    });
    req.sessionID = newSessionId; // Attach session ID to the request
  } else {
    // Use the existing session ID from the cookie
    req.sessionID = req.cookies.sessionId;
  }
  next();
};

// Middleware to track visits via GraphQL mutation
const trackVisits = async (req, res, next) => {
  try {
    console.log('Session ID:', req.sessionID);
    
    // Execute a mutation to increment stats
    await execute({
      schema,
      document: `
        mutation IncrementSiteStats {
          incrementSiteStats {
            totalViews
            uniqueVisits
            monthlyStats {
              year
              month
              totalViews
              uniqueVisits
              uniqueSessions
            }
          }
        }
      `,
      contextValue: { sessionId: req.sessionID }, // Pass session ID to track unique visits
    });
  } catch (error) {
    console.error('Error tracking visits:', error);
  }
  next();
};

// Start Apollo Server
const startApolloServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({
      sessionID: req.sessionID, // Pass session ID in the context
    }),
  });

  await server.start();

  // Use middleware for CORS
  app.use(
    cors({
      origin: 'http://localhost:5173', // Replace with your frontend's origin
      credentials: true, // Allow cookies to be sent
    })
  );

  // Use cookie-parser to parse cookies
  app.use(cookieParser());

  // Set up session middleware
  app.use(
    session({
      secret: 'your-secret-key',
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/Crater2',
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: 'lax',
        secure: false,
      },
    })
  );

  app.use((req, res, next) => {
    if (!req.session.views) {
      console.log('New session created:', req.sessionID);
      req.session.views = 1; // Initialize a session property
    } else {
      req.session.views++;
      console.log('Existing session:', req.sessionID, 'Views:', req.session.views);
    }
    next();
  });

  // Middleware for session ID management
  app.use(ensureSessionId);

  // Use trackVisits middleware
  app.use(trackVisits);

  // Set up middleware for parsing request bodies
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // GraphQL endpoint
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: authMiddleware, // This can include any authentication logic
    })
  );

  // Serve static assets in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  // Connect to the database and start the server
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

// Call the async function to start the server
startApolloServer();

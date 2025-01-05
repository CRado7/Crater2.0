const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');
const cors = require('cors');
const { authMiddleware } = require('./utils/auth');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { execute } = require('@graphql-tools/executor');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const uuid = require('uuid');
const MongoStore = require('connect-mongo');
require('dotenv').config();

const PORT = process.env.PORT || 3001;
const app = express();

// CORS Configuration for Production on Render
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'sessionId'],
    methods: ['GET', 'POST', 'OPTIONS'],
    preflightContinue: false, // Ensure the preflight is properly handled
    optionsSuccessStatus: 204, // Return success status for preflight requests
  })
);

// Preflight request support
// app.options('*', cors());

const schema = makeExecutableSchema({ typeDefs, resolvers });

const startApolloServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({
      sessionID: req.sessionID,
    }),
  });

  await server.start();

  app.use(cookieParser());

  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'your-secret-key',
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      },
    })
  );

  app.use((req, res, next) => {
    if (!req.session.sessionID) {
      req.session.sessionID = uuid.v4();
      res.cookie('sessionId', req.session.sessionID, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      });
    }
    next();
  });

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: ({ req }) => ({
        sessionID: req.session.sessionID,
      }),
    })
  );

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  db.once('open', () => {
    console.log('✅ Connected to MongoDB Atlas successfully!');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}/graphql`);
    });
  });

  db.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err);
  });
};

startApolloServer();

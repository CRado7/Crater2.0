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

const PORT = process.env.PORT || 3000;
const app = express();

const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGODB_URI,
  collectionName: 'sessions',  // Customize if needed
});

app.set('trust proxy', 1);

// CORS Configuration for Production on Render
const allowedOrigins = [
  'http://localhost:5173', 
  'https://crater2-0.onrender.com'
];

app.use(cors({
  origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
          callback(null, true);
      } else {
          callback(new Error('CORS policy violation'));
      }
  },
  credentials: true
}));

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
        store: sessionStore,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, // 1 day
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',  // Only secure in production
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        },
    })
);

// REMOVE MANUAL res.cookie SETTING - express-session handles it
  app.use((req, res, next) => {
      if (!req.session.sessionID) {
          req.session.sessionID = uuid.v4();
          req.session.save();  // Ensure the session is properly saved
      }
      next();
  });


  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use(
    '/graphql',
    expressMiddleware(server, {
        context: async ({ req }) => {
            // Ensure the sessionID is consistently attached
            if (!req.session.sessionID) {
                req.session.sessionID = uuid.v4();
                res.cookie('sessionId', req.session.sessionID, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
                });
            }
            console.log('Session ID:', req.session.sessionID);
            return { sessionID: req.session.sessionID };
          }
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

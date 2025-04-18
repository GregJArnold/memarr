import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { json } from 'body-parser';
import cors from 'cors';
import { initErrorReporting } from './utils/errorReporting';
import './config/database';
import { typeDefs, resolvers } from './resolvers/meme.ts';
import { makeExecutableSchema } from '@graphql-tools/schema';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';

const app = express();
const port = process.env.PORT || 4000;

// Initialize error reporting if DSN is provided
if (process.env.SENTRY_DSN) {
  initErrorReporting(process.env.SENTRY_DSN);
}

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Create executable schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

// Create Apollo Server
const server = new ApolloServer({
  schema
});

// Start the server
async function startServer() {
  await server.start();

  // Apply middleware
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    json(),
    graphqlUploadExpress(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        // TODO: Add authentication context
        return { user: null };
      }
    })
  );

  app.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}`);
    console.log(`🚀 GraphQL endpoint at http://localhost:${port}/graphql`);
  });
}

startServer().catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
}); 
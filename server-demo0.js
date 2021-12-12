const express = require('express');
const { graphqlHTTP } = require('express-graphql');

const app = express();
const PORT = 3001;

app.use('/graphql', graphqlHTTP({
  schema: '', // Schema is not properly setup for this
  graphiql: true // graphiql is a client
}));

// GraphiQL is an in-browser tool for writing, validating, and testing GraphQL queries.

app.listen(PORT, () => {
  console.log('GraphQL NodeJS App is running on http://localhost:3001/graphql');
});

// try node server_v1.js and check the app at http://localhost:3001/graphql
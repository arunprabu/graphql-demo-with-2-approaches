// #Apprach #2 - using GraphQLSchema 
// GraphQLSchema based approach does not use the schema definitional language (SDL), 
// it creates the schema programmatically.
// This approach has many advantages

const express = require('express');
const graphql = require('graphql');
const graphqlFields = require('graphql-fields');
const { GraphQLSchema, GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList } = graphql;

const { graphqlHTTP } = require('express-graphql');

const userData = require('./demo2-basic-data.json');

let app = express();
const PORT = 3001;

// Custom Object Type
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  })
});

// Step 1: Setting up RootQuery 
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    getUserList: {
      type: new GraphQLList(UserType),
      // args: { 
      //   id: {
      //     type: GraphQLInt
      //   }
      // },
      resolve(parent, args, context, info) {
        console.log(parent); // undefined
        console.log(args); // id
        console.log(context); 
        console.log("=========================");
        console.log(info);
        console.log("=========================");
        const topLevelFields = graphqlFields(info);
        console.log(topLevelFields); // in object format you can get
        console.log(Object.keys(topLevelFields)); // you can all keys here like ['id', 'name', 'phone']
        
        // You can process the above fields hereafter
        return userData;
      }
    },
    getUserById: {
      type: UserType,
      description: 'Enter Id to get the individual user object',
      args: { 
        id: {
          type: GraphQLInt
        }
      },
      resolve(parent, args) {
        if(args.id ){
          let id = args.id;
          let userDetails = userData.filter(user => {
            if(user.id == id){
              return user;
            }
          });
          console.log(userDetails);
          return userDetails[0];
        }
      }
    }
  }
});

// Step 2: Setting up Mutation - But will implement this later in server-demo2-advanced.js file
const Mutation = '';

// Let's have the schema for the app
// Schema is a combination of query and mutation
const schema = new GraphQLSchema({
    //it expects query inside
    query: RootQuery,       // we have to create RootQuery for the app and associate it here
    //mutation: Mutation // later in server-demo2-advanced.js file
});

// When we use this method of creating the API, 
// the root level resolvers are implemented on the Query and Mutation types 
// rather than on a root object.

app.use(express.json());
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true
}));


app.listen(PORT, () => {
  console.log('GraphQL NodeJS App is running on http://localhost:3001/graphql');
})
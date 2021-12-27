const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const graphqlFields = require('graphql-fields');
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList } = require('graphql');
const axios = require('axios');

const app = express();
const PORT = 3001;

const userData = require('./demo2-basic-data.json');

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    genre: { type: GraphQLString }
  })
});

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    phone: { type: GraphQLString }
  })
});

const PostType = new GraphQLObjectType({
  name: "Post",
  fields: () => ({
    userId: { type: GraphQLInt }, 
    id: { type: GraphQLInt },
    title: { type: GraphQLString },
    body: { type: GraphQLString }
  })
});

// Let's setup root query 
// RootQuery represents app wide queries
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryV2',
  fields: {
    hello: { // here's a hello field with resolve function
      type: GraphQLString,
      resolve(parent, args){
        return 'Hello World!';
      }
    },
    greet: {
      type: GraphQLString,
      args: { name: {type: GraphQLString }},
      resolve(parent, args) {
        console.log(parent);
        console.log(args);
        return `Good Morning, ${args.name}!`;
      }
    },
    book: {
      type: BookType,
      args: { id: {type: GraphQLInt }},
      resolve(parent, args) {
        
        console.log(args); // id will be in it. 
        // exec db query to fetch data for the id
        // but now mocking with the sample data here
        const bookDetails = {
          id: 1,
          name: 'How to GraphQL',
          genre: 'Tech'
        }
        
        return bookDetails;
      }
    },
    userList: {
      type: new GraphQLList(UserType),
      //args: { id: { type: GraphQLInt }},
      resolve(parent, args, context, info) {
        console.log(parent); // undefined
        console.log(args); // undefined
        console.log(context);  // req, res from express
        console.log("=========================");
        console.log(info); // carry the fields of the queried api
        console.log("=========================");
        const topLevelFields = graphqlFields(info);
        console.log(topLevelFields); // in object format - you can get
        console.log(Object.keys(topLevelFields)); // you can all keys here like ['id', 'name', 'phone']
        
        // You can process the above fields hereafter
        return userData;
      }
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLInt }},
      resolve(parent, args) {
        console.log(args);
        // exec db query to fetch user details for the id
        // now returning mock data
        // return {
        //     id: 1,
        //     name: "Arun",
        //     phone: "1212",
        //   }
        if(args.id ){
          let id = args.id;
          let userDetails = userData.filter(user => {
            if(user.id == id){
              return user;
            }
          });
          return userDetails[0];
        }
      }
    },
    posts: {
      type: new GraphQLList(PostType),
      async resolve() {  // if you use async await -- you need to have async for the function
        //Let's get data from External REST API
        // npm i axios
        console.log("Inside Posts");
        // return the promise also
        // return axios.get('https://jsonplaceholder.typicode.com/posts')
        //   .then( res => {
        //     return res.data
        //   })
        //   .catch( err => {
        //     console.log(err);
        //   })
        //   .finally( () => {
        //     console.log('It is over');
        //   });

        // The above will work. Alternatively you can use async await also. Note that resolve() has async 
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
        console.log(response.data);
        return response.data;
      }
    }
  }
});


// Now Let's work on Mutations
// Http Methods - POST, PUT, PATCH, DELETE can be handled here
const Mutation = new GraphQLObjectType({
  name: "MutationsV2",
  fields: {
    // Create, Update, Delete operations are the fields
    createUser: {
      type: UserType,
      // What can be args for creating user? the form data.
      args: {
        name: { type: GraphQLString },
        phone: { type: GraphQLString }
      },
      resolve(parent, args) {
        console.log(parent, args);
        //exec query and return the status of create operation
        return {
          id: 999, // trying mock id
          name: args.name,
          phone: args.phone
        }
      }
    },
    updateUser: {
      type: UserType,
      // What can be args for creating user? the form data.
      args: {
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        phone: { type: GraphQLString }
      },
      resolve(parent, args) {
        console.log(parent, args);
        //exec query and return the status of update operation
        return {
          id: args.id, // trying mock id
          name: args.name,
          phone: args.phone
        }
      }
    }
    // TODO: delete -- get id only as arg. 
    // after deleting just send the status. 
    // return type should be string or obj. It can't be UserType
  }
}); 

// Let's have the schema for the app
// Schema is a combination of query and mutation
const schema = new GraphQLSchema({
  //it expects query inside
  query: RootQuery,       // we have to create RootQuery for the app and associate it here
  mutation: Mutation // specify mutation here
});

app.use('/graphql', graphqlHTTP({
  schema: schema, // Schema is not properly setup for this
  graphiql: true // graphiql is a client
}));

// GraphiQL is an in-browser tool for writing, validating, and testing GraphQL queries.

app.listen(PORT, () => {
  console.log('GraphQL NodeJS App is running on http://localhost:3001/graphql');
});

// try node server-demo2-adv.js and check the app at http://localhost:3001/graphql

// Refer for better project structure
// https://github.com/arunprabu/graphql-node-demo1
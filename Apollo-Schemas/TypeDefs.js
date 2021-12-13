const { gql } = require("apollo-server-express");

  const typeDefs = gql`

    #Custom Data Types
    type User{
      id: Int,
      name: String,
      phone: String
    }

    #Queries
    type Query {
      hello: String
      getUserList: [User]
    }

    type Mutation{
      createUser(name: String, phone: String): User 
      #name and phone are args in the above line
    }
  `;

  module.exports = {typeDefs};
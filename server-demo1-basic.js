// Approach #1 - using buildSchema for just Query only. Not Mutations. 
// For Mutations Refer server-demo1-adv.js 
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

const app = express();
const PORT = 3000;

const schema = buildSchema(`
  type User{
    id: Int,
    name: String,
    phone: String,
    email: String
  } 

  """
    custom data type for employees - This is comment inside schema 
  """
  type Employee{
    getTotalEmployeesCount: Int,
    getEmployeesCount(type: String): String
  }

  type Query{
    hello: String,
    age: Int,
    quoteOfTheDay: String    
    greet(name: String): String, 
    registeredUserList: [String],
    user: User,
    userList: [User],
    employees(type: String): Employee
  }
`);

// This class implements the Employee GraphQL type -- This is used in resolver
class Employee {
  
  constructor( type){
    this.empTypes = type;
  }

  getTotalEmployeesCount() {
    return Math.floor(Math.random() * 50);
  }

  getEmployeesCount({type}){
    return `${type} employees count: ${Math.floor(Math.random() * 10)}` ;
  }
}


// Try the following query to call a fn 
// {
//   greet(name: "Arun") 
// }

const root = { 
  hello: () => {
    // ideal place for you to exec db queries
    return 'Hello World!';
  },
  age: () => {
    return 20;
  },
  quoteOfTheDay: () => {
    return Math.random() < 0.5 ? 'Never give up' : 'Do not wait for the right time.Create it';
  },
  greet: (args) => {
    console.log(args); // args - an object -- will fetch you the passed params from the query
    return `Good Morning, ${args.name}!`;
  },
  registeredUserList: () => {
    const users = ['John', 'Victor', 'Don'];
    return users;
  },
  user: () => {
    const tempUser = {
      id: 1, 
      name: "Arun",
      email: "a@b.com",
      phone: "234234"
    }
    return tempUser;
  },
  userList: (args ) => {
    const tempUsers = [
      {
        id: 1,
        name: "A",
        email: "a@b.com",
        phone: "34232324"
      },
      {
        id: 2,
        name: "B",
        email: "b@c.com",
        phone: "3423432"
      },
      {
        id: 3,
        name: "C",
        email: "c@d.com",
        phone: "242354464"
      }
    ];
    return tempUsers;
  },
  employees: (args) => {
    console.log(args.type);
    return new Employee(args.type)
  }
}

// Employee related query can be called like the following
/*
{
  	employees(type: "Fulltime") {
  	  getTotalEmployeesCount,
    	getEmployeesCount(type: "Contract")
  	}
}
*/

// http://localhost:3000/graphql 
app.use('/graphql', graphqlHTTP({
  schema: schema, // Schema is not properly setup for this
  rootValue: root, // let's use the resolver here
  graphiql: true // client interface for querying
}));
// GraphiQL is an in-browser tool for writing, validating, and testing GraphQL queries and doing mutations

app.listen(PORT, () => {
  console.log('GraphQL NodeJS App is running on http://localhost:3000/graphql');
});


// Refer for Mutations in this approach
// https://graphql.org/graphql-js/mutations-and-input-types/ 

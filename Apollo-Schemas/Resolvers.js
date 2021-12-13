const resolvers = {
  Query: {
    hello(){
      return 'Hey!'
    },
    getUserList(){
      // db query
      return [{
        id: 1,
        name: "Arun",
        phone: "234234"
      }]
    }
  },
  Mutation: {
    createUser(parent, args){
      console.log(args);
      return {
        id: 999,
        name: args.name,
        phone: args.phone
      }
    }
  }
}

module.exports = { resolvers };
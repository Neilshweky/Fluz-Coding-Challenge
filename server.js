var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
var db = require('./models/database.js');
const knexfile = require('./knexfile.js');
const knex = require('knex')(knexfile);

var schema = buildSchema(`
  type User {
    username: String!
    password: String!
    calorie_intake: Int
    calorie_spend: Int
    relationship: Int
  }

  type Friend {
      from: String!,
      to: String!
  }

  type Query {
    login(username: String!, password: String!): [User]
    getuser(username: String!): User
  }

  type Mutation {
        signup(username: String!, password: String!): User
        addfriend(username: String!, friend: String!): [Friend]
        addintake(username: String!, intake: Int!): [User]
        removeintake(username: String!, intake: Int!): [User]
        addspend(username: String!, spend: Int!): [User]
        removespend(username: String!, spend: Int!): [User]
  }
`);



// The root provides a resolver function for each API endpoint
var root = {
    login: (data) => {
        return db.login(data.username, data.password).then(result => {
            return result
        })
    },
    getuser: (data) => {
        return db.getUser(data.username).then(result => {
            return result
        })
    },
    signup: (data) => {
        return db.signUp(data.username, data.password).then(result => {
            return result
        })
    },
    addfriend: (data) => {
        return db.addFriend(data.username, data.friend).then(result => {
            return result
        })
    },
    addintake: (data) => {
        return db.addIntake(data.username, data.intake).then(result => {
            return result
        })
    },
    removeintake: (data) => {
        return db.removeIntake(data.username, data.intake).then(result => {
            return result
        })
    },
    addspend: (data) => {
        return db.addSpend(data.username, data.spend).then(result => {
            return result
        })
    },
    removespend: (data) => {
        return db.removeSpend(data.username, data.spend).then(result => {
            return result
        })
    }


};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');


// app.get('/login', res.render())

// db.removeSpend('User8', 100).then(result=> {
//     console.log(result)
// })
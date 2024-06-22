const { buildSchema } = require("graphql");

const schema = buildSchema(`
  type Organization {
    id: ID!
    name: String!
  }
  type User {
    id: ID!
    username: String!
    role: String!
    organizationId: ID!
  }
  type Task {
    id: ID!
    title: String!
    description: String
    status: String!
    dueDate: String
    userId: ID!
    organizationId: ID!
  }
  type Query {
    organizations: [Organization]
    users: [User]
    tasks: [Task]
  }
  enum Role {
    admin
    manager
    user
  }
  input CreateUserInput {
    username: String!
    password: String!
    role: Role!
    organizationId: ID
    organizationName: String
  }
  enum Status {
    todo
    in_progress
    done
  }
  type AuthPayload {
    token: String!
    user: User!
  }
  input CreateTaskInput {
    title: String!
    description: String
    status: Status
    dueDate: String
    userId: ID!
    organizationId: ID!
  }
  type Mutation {
    createUser(input: CreateUserInput!): User
    loginUser(username: String!, password: String!): AuthPayload
    createTask(input: CreateTaskInput!): Task
    updateTask(id: ID!, input: CreateTaskInput!): Task
    deleteTask(id: ID!): Task
  }
`);

module.exports = schema;

const { gql } = require("apollo-server");

const typeDefs = gql`
  type Project {
    name: String
    id: ID
  }

  type Token {
    token: String
  }

  type Task {
    name: String
    id: ID
    projectId: String
    state: Boolean
  }

  type Query {
    getProjects: [Project]
    getTasks(input: projectIDInput): [Task]
  }

  input UserInput {
    name: String!
    email: String!
    password: String!
  }

  input AuthenticateInput {
    email: String!
    password: String!
  }

  input ProjectInput {
    name: String!
  }

  input projectIDInput {
    projectId: String!
  }

  input TaskInput {
    name: String!
    projectId: String!
  }

  type Mutation {
    # Projects
    createUser(input: UserInput): String
    authenticateUser(input: AuthenticateInput): Token
    createProject(input: ProjectInput): Project
    updateProject(id: ID!, input: ProjectInput): Project
    deleteProject(id: ID!): String

    # Tasks
    createTask(input: TaskInput): Task
    updateTask(id: ID!, input: TaskInput, state: Boolean): Task
    deletTask(id: ID!): String
  }
`;

module.exports = typeDefs;

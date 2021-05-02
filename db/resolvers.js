const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config({ path: '.env' });

// Models
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');

// Crea y forma un JWT
const createToken = (user, secret, expiresIn) => {
  const { id, email } = user;

  return jwt.sign({ id, email }, secret, { expiresIn });
};

const resolvers = {
  Query: {
    getProjects: async (_, __, context) => {
      const projects = await Project.find({ author: context.user.id });

      return projects;
    },
    getTasks: async (_, { input }, context) => {
      const tasks = await Task.find({ author: context.user.id })
        .where('projectId')
        .equals(input.projectId);

      return tasks;
    },
  },
  Mutation: {
    createUser: async (_, { input }) => {
      const { email, password } = input;

      const userExists = await User.findOne({ email });

      if (userExists) {
        throw new Error('user is already registered');
      }

      try {
        // Encrypting password
        const salt = await bcryptjs.genSalt(10);
        input.password = await bcryptjs.hash(password, salt);

        // Register new user
        const newUser = new User(input);
        newUser.save();
        return 'user created successfully';
      } catch (error) {
        console.log(error);
      }
    },
    authenticateUser: async (_, { input }) => {
      const { email, password } = input;

      // validate if user exists
      const userExists = await User.findOne({ email });
      if (!userExists) {
        throw new Error('user does not exist');
      }

      // validate if the password is correct
      const correctPassword = await bcryptjs.compare(password, userExists.password);

      if (!correctPassword) {
        throw new Error('Incorrect password');
      }

      // access to the application
      return {
        token: createToken(userExists, process.env.SECRET, '2hr'),
      };
    },
    createProject: async (_, { input }, context) => {
      try {
        const project = new Project(input);

        project.author = context.user.id;
        const result = await project.save();

        return result;
      } catch (error) {
        console.log(error);
      }
    },
    updateProject: async (_, { id, input }, context) => {
      // validate if project exists
      let project = await Project.findById(id);
      if (!project) {
        throw new Error('project not found');
      }

      // check if the person who edits is the author
      if (project.author.toString() !== context.user.id) {
        throw new Error("You don't have the credentials to edit");
      }

      // Save project
      project = await Project.findOneAndUpdate({ _id: id }, input, {
        new: true,
      });

      return project;
    },
    deleteProject: async (_, { id }, context) => {
      // validate if project exists
      let project = await Project.findById(id);
      if (!project) {
        throw new Error('project not found');
      }

      // check if the person who edits is the author
      if (project.author.toString() !== context.user.id) {
        throw new Error("You don't have the credentials to edit");
      }

      // Delete project
      project = await Project.findByIdAndDelete({ _id: id });

      return 'project deleted';
    },
    createTask: async (_, { input }, context) => {
      try {
        const task = new Task(input);
        task.author = context.user.id;

        const result = await task.save();
        return result;
      } catch (error) {
        console.log(error);
      }
    },
    updateTask: async (_, { id, input, state }, context) => {
      // validate if project exists
      let task = await Task.findById(id);

      if (!task) {
        throw new Error('task not found');
      }

      // check if the person who edits is the author
      if (task.author.toString() !== context.user.id) {
        throw new Error("You don't have the credentials to edit");
      }

      // add state
      input.state = state;

      // Save task
      task = await Task.findOneAndUpdate({ _id: id }, input, {
        new: true,
      });

      return task;
    },
    deletTask: async (_, { id }, context) => {
      // validate if task exists
      let task = await Task.findById(id);

      if (!task) {
        throw new Error('task not found');
      }

      // check if the person who edits is the author
      if (task.author.toString() !== context.user.id) {
        throw new Error("You don't have the credentials to edit");
      }

      // Delete task
      task = await Task.findByIdAndDelete({ _id: id });

      return 'task deleted';
    },
  },
};

module.exports = resolvers;

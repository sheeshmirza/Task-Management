const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Task = require("../models/Task");
const Organization = require("../models/Organization");

const generateAuthToken = async (user) => {
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

const findByCredentials = async (username, password) => {
  const user = await User.findOne({ username });
  if (!user) {
    throw new Error("Invalid login credentials");
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error("Invalid login credentials");
  }
  return user;
};

const resolvers = {
  Query: {
    organizations: async (_, args, { user }) => {
      try {
        if (user.role === "admin") {
          return await Organization.find();
        } else {
          throw new Error("Not authorized to fetch organizations");
        }
      } catch (err) {
        throw new Error("Failed to fetch organizations");
      }
    },
    users: async (_, args, { user }) => {
      try {
        if (user.role === "admin" || user.role === "manager") {
          return await User.find(
            { organizationId: user.organizationId },
            { password: 0 }
          );
        } else {
          throw new Error("Not authorized to fetch users");
        }
      } catch (err) {
        throw new Error("Failed to fetch users");
      }
    },
    tasks: async (_, args, { user }) => {
      try {
        if (user.role === "admin") {
          return await Task.find();
        } else if (user.role === "manager") {
          return await Task.find({ organizationId: user.organizationId });
        } else if (user.role === "user") {
          return await Task.find({ userId: user._id });
        } else {
          return [];
        }
      } catch (err) {
        throw new Error("Failed to fetch tasks");
      }
    },
  },
  Mutation: {
    createUser: async (_, { input }, { user }) => {
      try {
        const { username, password, role, organizationId, organizationName } =
          input;

        if (role === "admin" && organizationName) {
          const newOrganization = new Organization({ name: organizationName });
          await newOrganization.save();
          const newUser = new User({
            username,
            password,
            role,
            organizationId: newOrganization._id,
          });
          await newUser.save();
          return newUser;
        } else if (
          role === "manager" &&
          organizationId &&
          (user.role === "admin" || user.role === "manager")
        ) {
          const organization = await Organization.findById(organizationId);
          if (!organization) {
            throw new Error("Organization not found");
          }
          const newUser = new User({
            username,
            password,
            role,
            organizationId: organization._id,
          });
          await newUser.save();
          return newUser;
        } else if (
          role === "user" &&
          (organizationId || user.role === "admin" || user.role === "manager")
        ) {
          let organization;
          if (organizationId) {
            organization = await Organization.findById(organizationId);
          } else {
            organization = await Organization.findById(user.organizationId);
          }
          if (!organization) {
            throw new Error("Organization not found");
          }
          const newUser = new User({
            username,
            password,
            role,
            organizationId: organization._id,
          });
          await newUser.save();
          return newUser;
        } else {
          throw new Error("Unauthorized to create a user");
        }
      } catch (err) {
        throw new Error("Failed to create user");
      }
    },
    loginUser: async (_, { username, password }) => {
      try {
        const user = await findByCredentials(username, password);
        const token = await generateAuthToken(user);
        return { token, user };
      } catch (err) {
        throw new Error("Invalid login credentials");
      }
    },
    createTask: async (_, { input }, { user }) => {
      try {
        if (user.role === "user") {
          input.userId = user._id;
        } else if (user.role === "manager") {
          const isUserManaged = await User.exists({
            _id: input.userId,
            organizationId: user.organizationId,
          });
          if (!isUserManaged) {
            throw new Error("You can only create tasks for users you manage");
          }
        }
        const newTask = new Task(input);
        await newTask.save();
        return newTask;
      } catch (err) {
        throw new Error("Failed to create task");
      }
    },
    updateTask: async (_, { id, input }, { user }) => {
      try {
        const task = await Task.findById(id);
        if (!task) {
          throw new Error("Task not found");
        }
        if (
          user.role === "user" &&
          task.userId.toString() !== user._id.toString()
        ) {
          throw new Error("Unauthorized to update task");
        }
        if (user.role === "manager") {
          const isUserManaged = await User.exists({
            _id: task.userId,
            organizationId: user.organizationId,
          });
          if (!isUserManaged) {
            throw new Error("You can only update tasks for users you manage");
          }
        }
        Object.assign(task, input);
        await task.save();
        return task;
      } catch (err) {
        throw new Error("Failed to update task");
      }
    },
    deleteTask: async (_, { id }, { user }) => {
      try {
        const task = await Task.findById(id);
        if (!task) {
          throw new Error("Task not found");
        }
        if (
          user.role === "user" &&
          task.userId.toString() !== user._id.toString()
        ) {
          throw new Error("Unauthorized to delete task");
        }
        if (user.role === "manager") {
          const isUserManaged = await User.exists({
            _id: task.userId,
            organizationId: user.organizationId,
          });
          if (!isUserManaged) {
            throw new Error("You can only delete tasks for users you manage");
          }
        }
        await Task.deleteOne(task);
        return task;
      } catch (err) {
        throw new Error("Failed to delete task");
      }
    },
  },
};

module.exports = resolvers;

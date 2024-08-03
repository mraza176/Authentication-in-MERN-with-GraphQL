import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";

export const resolvers = {
  Query: {
    authUser: async (_, __, context) => {
      try {
        const user = await context.getUser();
        return user;
      } catch (error) {
        throw new Error(error);
      }
    },
    user: async (_, { userId }) => {
      try {
        const user = await userModel.findById(userId);
        return user;
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Mutation: {
    signUp: async (_, { input }, context) => {
      try {
        const { name, email, password, gender } = input;

        if (!name || !email || !password || !gender) {
          throw new Error("All fields are required");
        }
        const userExists = await userModel.findOne({ email });

        if (userExists) {
          throw new Error("User already exists");
        }

        const hashedPassword = await bcrypt.hashSync(password, 10);

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${name}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${name}`;

        const newUser = await userModel.create({
          name,
          email,
          password: hashedPassword,
          profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
          gender,
        });
        await context.login(newUser);
        return newUser;
      } catch (error) {
        throw new Error(error);
      }
    },
    login: async (_, { input }, context) => {
      try {
        const { email, password } = input;
        const { user } = await context.authenticate("graphql-local", {
          email,
          password,
        });
        await context.login(user);
        return user;
      } catch (error) {
        throw new Error(error);
      }
    },
    logout: async (_, __, context) => {
      try {
        await context.logout();
        context.req.session.destroy((err) => {
          if (err) {
            throw new Error(err);
          }
        });
        context.res.clearCookie("connect.sid");
        return { message: "Logged out successfully" };
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};

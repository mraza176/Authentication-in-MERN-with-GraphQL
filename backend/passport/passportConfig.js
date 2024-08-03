import passport from "passport";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import { GraphQLLocalStrategy } from "graphql-passport";

export const configurePassport = async () => {
  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userModel.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  passport.use(
    new GraphQLLocalStrategy(async (email, password, done) => {
      try {
        const user = await userModel.findOne({ email });
        if (!user) {
          throw new Error("Invalid email or password");
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          throw new Error("Invalid email or password");
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );
};

import User from "../models/User.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
export default class UserService {

    getUsers = async () => {
        return await User.find({})
    }

    addNewUser = async (newUser) => {
        let user;
        try {
            user = new User({
                email: newUser.email,
                password: bcrypt.hashSync(newUser.password, 8)
            })
        } catch (e) {
            throw new Error("Invalid new user");
        }
        return await user.save();
    }

    loginUser = async ({ email, password }) => {
        let user;
        try {
            user = await User.findOne({ email: email });
        } catch (e) {
            throw new Error("Internal system error")
        }

        if (!user) {
            throw new Error("User not found in database")
        }
    }

}
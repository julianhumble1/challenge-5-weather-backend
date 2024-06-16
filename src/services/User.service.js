import User from "../models/User.model.js";

export default class UserService {

    getUsers = async () => {
        console.log("reached service")
        return await User.find({})
    }

    addNewUser = async (newUser) => {
        let user;
        try {
            user = new User(newUser)
        } catch (e) {
            throw new Error("Invalid new user");
        }
        return await user.save();
    }

}
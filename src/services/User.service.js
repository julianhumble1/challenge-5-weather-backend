import User from "../models/User.model.js";

export default class UserService {

    getUsers = async () => {
        return await User.find({})
    }

}
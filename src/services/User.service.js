import User from "../models/User.model.js";

export default class UserService {

    getTodos = async () => {
        return await User.find({})
    }

}
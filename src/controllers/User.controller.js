import UserValidator from "../middleware/UserValidator.js";
import UserService from "../services/User.service.js";

export default class UserController {
    
    #service;

    constructor(service = new UserService()) {
        this.#service = service
    }

    getUsers = async (req, res) => {
        const users = await this.#service.getUsers()
        res.json(users)
    }

    addNewUser = async (req, res) => {
        UserValidator.handleValidationErrors(req, res)
        try {
            const newUser = await this.#service.addNewUser(req.body)
            res.status(201).json(newUser)
        } catch (error) {
            res.status(500).json("Internal server error")
        }
    }

}
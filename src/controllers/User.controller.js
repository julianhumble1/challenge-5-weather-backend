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

    loginUser = async (req, res) => {
        UserValidator.handleValidationErrors(req, res)
        let response;
        try {
            response = await this.#service.loginUser(req.body)
        } catch (e) {
            if (e.message === "Internal system error") {
                res.status(500).json(e.message)
            } else if (e.message === "User not found in database") {
                res.status(404).json(e.message)
            }
        }

        if (response.accessToken === null) {
            res.status(401).json("Invalid username/password combination")
        } else {
            res.status(201).json(response)
        }
    }

}
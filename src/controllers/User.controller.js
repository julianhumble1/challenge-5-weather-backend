import UserValidator from "../middleware/UserValidator.js";
import UserService from "../services/User.service.js";

export default class UserController {
    
    #service;

    constructor(service = new UserService()) {
        this.#service = service
    }

    getUsers = (req, res) => {
        res.send(this.#service.getUsers())
    }

    addNewUser = async (req, res) => {
        console.log("reached controller")
        UserValidator.handleValidationErrors(req, res)
        try {
            const newUser = await this.#service.addNewUser(req.body)
            res.status(201).json(newUser)
        } catch (error) {
            res.status(500).send("Internal server error")
        }
    }

}
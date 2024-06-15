import UserService from "../services/User.service.js";

export default class UserController {
    
    #service;

    constructor(service = new UserService()) {
        this.#service = service
    }

    getTodos = (req, res) => {
        res.send(this.#service.getTodos())
    }

}
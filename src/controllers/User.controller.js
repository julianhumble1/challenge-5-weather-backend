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
            return res.status(201).json(newUser)
        } catch (error) {
            return res.status(500).json("Internal server error")
        }
    }

    loginUser = async (req, res) => {
        UserValidator.handleValidationErrors(req, res)
        let response;
        try {
            response = await this.#service.loginUser(req.body)
        } catch (e) {
            if (e.message === "Internal system error") {
                return res.status(500).json(e.message)
            } else if (e.message === "User not found in database") {
                return res.status(404).json(e.message)
            }
        }

        if (response.accessToken === null) {
            return res.status(401).json("Invalid username/password combination")
        } else {
            return res.status(201).json(response)
        }
    }

    updatePassword = async (req, res) => {
        UserValidator.handleValidationErrors(req, res);
        try {
            await this.#service.updatePassword(req.body)
            res.status(200).send("Successfully updated password")
        } catch (e) {
            if (e.message === "Internal system error") {
                return res.status(500).json(e.message)
            } else if (e.message === "User not found in database") {
                return res.status(404).json(e.message)
            } else if (e.message === "Email and password do not match") {
                return res.status(401).json(e.message)
            }
        }
    }

    getFavLocations = async (req, res) => {
        UserValidator.handleValidationErrors(req, res);
        let response;
        try {
            response = await this.#service.getFavLocations(req.body)
        } catch (e) {
            if (e.message === "Internal system error") {
                return res.status(500).json(e.message)
            } else if (e.message === "User not found in database") {
                return res.status(404).json(e.message)
            }
        }
        return res.status(201).json(response.favouriteLocations)
    }

    addFavLocation = async (req, res) => {
        UserValidator.handleValidationErrors(req, res);
        try {
            await this.#service.addFavLocation(req.body)
        } catch (e) {
            if (e.message === "Internal system error") {
                return res.status(500).json(e.message)
            } else if (e.message === "User not found in database") {
                return res.status(404).json(e.message)
            } else if (e.message === "Location already in favourites") {
                return res.status(400).json(e.message)
            }
        }

        return res.status(res.status(200).json("Successfully added location to favourites"))
    }

}
import { Router } from "express";
import UserController from "../controllers/User.controller.js";
import UserValidator from "../middleware/UserValidator.js";

export default class UserRoutes {

    #router;
    #routeStartPoint;
    #controller

    constructor(controller = new UserController(), routeStartPoint = "/") {
        this.#controller = controller;
        this.#routeStartPoint = routeStartPoint;
        this.#router = new Router();
        this.#initialiseRoutes();
    }

    #initialiseRoutes = () => {
        this.#router.get(
            "/",
            this.#controller.getUsers)
        this.#router.post(
            "/",
            ...UserValidator.validateNewUser(),
            this.#controller.addNewUser
        )
    } 

    getRouter = () => {
        return this.#router
    }

    getRouteStartPoint = () => {
        return this.#routeStartPoint
    }
}
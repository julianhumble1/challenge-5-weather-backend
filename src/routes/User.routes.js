import { Router } from "express";
import UserController from "../controllers/User.controller.js";
import UserValidator from "../middleware/UserValidator.js";
import authJWT from "../middleware/authJWT.js";

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

        this.#router.use((req, res, next) => {
            res.header(`Access-Control-Allow-Headers`, `x-access-token, Origin, Content-Type, Accept`);
            next();
        });

        this.#router.get(
            "/",
            this.#controller.getUsers
        )
        this.#router.post(
            "/",
            ...UserValidator.validateEmailPassword(),
            this.#controller.addNewUser
        )
        this.#router.post(
            "/login",
            ...UserValidator.validateEmailPassword(),
            this.#controller.loginUser
        )

        this.#router.patch(
            "/updatePassword",
            [authJWT.verifyToken, authJWT.isCorrectId, ...UserValidator.validateEmailAndUpdatedPassword()],
            this.#controller.updatePassword
        )  
        this.#router.get(
            "/fav",
            [authJWT.verifyToken, authJWT.isCorrectId, ...UserValidator.validateEmail()],
            this.#controller.getFavLocations
        )
        this.#router.patch(
            "/addfav", 
            [authJWT.verifyToken, authJWT.isCorrectId, ...UserValidator.validateEmail()],
            this.#controller.addFavLocation
        )
        this.#router.patch(
            "/removefav",
            [authJWT.verifyToken, authJWT.isCorrectId, ...UserValidator.validateEmail()],
            this.#controller.removeFavLocation
        )
    } 

    getRouter = () => {
        return this.#router
    }

    getRouteStartPoint = () => {
        return this.#routeStartPoint
    }
}
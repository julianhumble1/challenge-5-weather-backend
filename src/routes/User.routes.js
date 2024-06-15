import { Router } from "express";

export default class UserRoutes {

    #router;
    #routeStartPoint;

    constructor(routeStartPoint = "/") {
        this.#routeStartPoint = routeStartPoint;
        this.#router = new Router();
        this.#initialiseRoutes();
    }

    #initialiseRoutes = () => {

    }

    getRouter = () => {
        return this.#router
    }

    getRouteStartPoint = () => {
        return this.#routeStartPoint
    }
}
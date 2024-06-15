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
        this.#router.get("/", (req, res) => res.send("Getting todos"))
    }  

    getRouter = () => {
        return this.#router
    }

    getRouteStartPoint = () => {
        return this.#routeStartPoint
    }
}
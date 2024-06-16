import express from "express";

export default class Server {
    #app;
    #port;
    #host;
    #router;
    #server;

    constructor(port, host, router) {
        this.#app = express();
        this.#port = port;
        this.#host = host;
        this.#router = router;
        this.#server = null;
    }

    start = () => {
        this.#server = this.#app.listen(this.#port, this.#host, () => {
            console.log(`Server is listening on http://${this.#host}:${this.#port}`)
        })

        this.#app.use(express.json())
        this.#app.use(
            this.#router.getRouteStartPoint(),
            this.#router.getRouter()
        )
    }

    close = () => {
        this.#server?.close();
    }

    getApp = () => {
        return this.#app
    }
}
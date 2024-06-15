import express from "express";

export default class Server {
    #app;
    #host;
    #port;
    #router;
    #server;

    constructor(host, port, router) {
        this.#app = express();
        this.#host = host;
        this.#port = port;
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
}
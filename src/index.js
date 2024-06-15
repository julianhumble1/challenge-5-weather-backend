import Config from "./config/Config.js";
import Database from "./db/Database.js";
import Server from "./server/Server.js";
import UserRoutes from "./routes/User.routes.js"

Config.load();
const { PORT, HOST, DB_URI } = process.env;

const userRoutes = new UserRoutes();

const database = new Database(DB_URI);
database.connect();

const server = new Server(PORT, HOST, userRoutes);
server.start()
import Config from "./config/Config.js";
import Database from "./db/Database.js";

Config.load();
const { PORT, HOST, DB_URI } = process.env;

const database = new Database(DB_URI);
database.connect();
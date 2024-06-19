import { expect } from "chai"
import supertest from "supertest"

import Config from "../../src/config/Config.js"
import Database from "../../src/db/Database.js"
import Server from "../../src/server/Server.js"
import User from "../../src/models/User.model.js"
import UserController from "../../src/controllers/User.controller.js"
import UserRoutes from "../../src/routes/User.routes.js"
import UserService from "../../src/services/User.service.js"

import generateTestData from "../data/testUsers.js"
const { testUsers, getFavLocationsUser } = await generateTestData();

describe("getFavLocations integration tests", () => {
    let userServer;
    let userService;
    let database;
    let request;

    const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NmViZjUxY2RmMWNmZjhlNjdiNmZjNCIsImlhdCI6MTcxODczNDYwNiwiZXhwIjoxNzE4ODIxMDA2fQ.buNU2i-GuqjnrezkUx_WEo9FyqpEvO2nU6g-AzWlTlE";

    before(async () => {
        Config.load();
        const { PORT, HOST, DB_URI } = process.env;
        userService = new UserService();
        const userController = new UserController(userService);
        const userRoutes = new UserRoutes(userController);
        database = new Database(DB_URI);
        await database.connect();
        userServer = new Server(PORT, HOST, userRoutes);
        userServer.start();
        request = supertest(userServer.getApp())
    })

    after(async () => {
        await userServer.close();
        await database.close();
    })

    beforeEach(async () => {
        try {
            await User.deleteMany();
            console.log("Database cleared")
        } catch (e) {
            console.log(e.message);
            console.log("Error clearing");
            throw new Error();
        }

        try {
            await User.insertMany(testUsers);
            console.log("Database populated with test users");
        } catch (e) {
            console.log(e.message);
            console.log("Error inserting");
            throw new Error();
        }

    })

    describe("GET requests to '/fav'", () => {
        it("should respond with 403 if no token is provided", async () => {
            // Arrange
            // Act
            const response = await request.get("/fav")
                .send(getFavLocationsUser)
            // Assert
            expect(response.status).to.equal(403)
        })

        it("should respond with 401 if access token can't be decoded", async () => {
            // Arrange
            const badAccessToken = "123"
            // Act
            const response = await request.get("/fav")
                .set("x-access-token", badAccessToken)
                .send(getFavLocationsUser)
            // Assert
            expect(response.status).to.equal(401)
        })

        it("should respond with 404 if email is not in database", async () => {
            // Arrange
            const invalidRequest = { ...getFavLocationsUser, email:"userdoesnotexist@email.com" }
            // Act
            const response = await request.get("/fav")
                .set("x-access-token", accessToken)
                .send(invalidRequest)
            // Assert
            expect(response.status).to.equal(404)
        })

        it("should respond with status code 201 if successful", async () => {   
            // Arrange
            // Act
            const response = await request.get("/fav")
                .set("x-access-token", accessToken)
                .send(getFavLocationsUser)
            // Assert
            expect(response.status).to.equal(201)
        })
    })
})
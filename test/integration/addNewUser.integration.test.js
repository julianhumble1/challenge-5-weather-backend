import { expect } from "chai"
import sinon from "sinon"
import supertest from "supertest"

import Config from "../../src/config/Config.js"
import Database from "../../src/db/Database.js"
import Server from "../../src/server/Server.js"
import User from "../../src/models/User.model.js"
import UserController from "../../src/controllers/User.controller.js"
import UserRoutes from "../../src/routes/User.routes.js"
import UserService from "../../src/services/User.service.js"

import testData from "../data/testUsers.js"
const { testUsers, newUser } = testData;

describe("addNewUser integration tests", () => {
    let userServer;
    let userService;
    let database;
    let request;

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
            console.log("Databse populated with test users");
        } catch (e) {
            console.log(e.message);
            console.log("Error inserting");
            throw new Error();
        }
    })

    describe("POST requests to '/' to userRoutes", () => {
        it("should response with a 201 status code if successful", async () => {
            // Arrange
            // Act
            const response = await request.post("/").send(newUser);
            // Assert
            expect(response.status).to.equal(201);
        })

        it("should respond with the created user if successful", async () => {
            // Arrange
            // Act
            const response = await request.post("/").send(newUser);
            // Assert
            expect(response.body).to.include(newUser);
        })

        it("should add the new user to the database if successful", async () => {
            // Arrange
            // Act
            await request.post("/").send(newUser);
            const response = await request.get("/");
            const addedUser = response.body.find((user) => 
                user.email === newUser.email
            )
            // Assert
            expect(addedUser).to.include(newUser);
        })
        
        it("should respond with a 500 status code if there is an error", async () => {
            // Arrange
            const serviceStub = sinon.stub(userService, "addNewUser")
            serviceStub.throws(new Error("test error")); 
            // Act
            const response = await request.post("/").send(newUser);
            // Assert
            expect(response.status).to.equal(500);
        })

        it("should respond with response code 400 if bad request - invalid email", async () => {
            // Arrange
            const invalidUser = { ...newUser, email: "email" }
            // Act
            const response = await request.post("/").send(invalidUser);
            // Assert
            expect(response.status).to.equal(400);
        })

        it("should response with response code 400 if bad request - no email", async () => {
            // Arrange
            const invalidUser = { ...newUser }
            delete invalidUser.email;
            // Act
            const response = await request.post("/").send(invalidUser);
            // Assert
            expect(response.status).to.equal(400);
        })

        it("should response with response code 400 if bad request - invalid password", async () => {
            // Arrange
            const invalidUser = { ...newUser, password: "password" }
            // Act
            const response = await request.post("/").send(invalidUser);
            // Assert
            expect(response.status).to.equal(400);
        })

        it("should response with response code 400 if bad request - no password", async () => {
            // Arrange
            const invalidUser = { ...newUser }
            delete invalidUser.password;
            // Act
            const response = await request.post("/").send(invalidUser);
            // Assert
            expect(response.status).to.equal(400);
        })
    })
})
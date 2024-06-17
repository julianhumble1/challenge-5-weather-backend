import { expect } from "chai";
import sinon from "sinon";

import UserController from "../../src/controllers/User.controller.js";
import UserValidator from "../../src/middleware/UserValidator.js";

describe("UserController tests", () => {

    let userController;
    let userServices;

    let req, res, next;
    let userValidatorStub;

    res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
    }

    describe("addNewUser request tests", () => {

        beforeEach(() => {
            userServices = {
                    addNewUser: sinon.stub()
                }
            userController = new UserController(userServices)

            req = {
                body:
                    {"email": "user@example.com",
                    "password": "password1!"}
            }     
            
            next = sinon.spy();
            userValidatorStub = sinon.stub(UserValidator, "handleValidationErrors").callsFake((req, res, next) => next)
        })

        afterEach(() => {
                sinon.restore();
        })

        describe("successful request tests", () => {
    
            let newUser = {
                "email": "user@example.com",
                "password": "password1!",
                "favouriteLocations": [],
                "_id": "666eecdb4463cfb7134ef2ac",
                "__v": 0
            }
    
            it("should respond with new user in body if request is successful", async () => {
                // Arrange
                userServices.addNewUser.resolves(newUser);
                // Act
                await userController.addNewUser(req, res)
                // Assert
                expect(res.json.calledWith(newUser)).to.be.true;
            })
    
            it("should respond with status code 201 if request is successful", async () => {
                // Arrange
                userServices.addNewUser.resolves(newUser);
                // Act
                await userController.addNewUser(req, res);
                // Assert
                expect(res.status.calledWith(201)).to.be.true;
            })
        })

        describe("unsuccessful request tests", () => {

            it("should respond with 500 code if addNewUser service throws error", async () => {
                // Arrange
                userServices.addNewUser.rejects(new Error("service error"))
                // Act
                await userController.addNewUser(req, res)
                // Assert
                expect(res.status.calledWith(500)).to.be.true;
            })
        })
    })

    describe("login request tests", () => {

         beforeEach(() => {
            userServices = {
                    loginUser: sinon.stub()
                }
            userController = new UserController(userServices)

            req = {
                body:
                    {"email": "user@example.com",
                    "password": "password1!"}
            }     
            
            next = sinon.spy();
            userValidatorStub = sinon.stub(UserValidator, "handleValidationErrors").callsFake((req, res, next) => next)
        })

        afterEach(() => {
                sinon.restore();
        })

        const validServiceResponse = {
            email: "email1@email.com",
            password: "password1!",
            accessToken: "validToken"
            }

        it("should respond with details and access token if request is successful", async () => {
            // Arrange
            userServices.loginUser.resolves(validServiceResponse)
            // Act
            await userController.loginUser(req, res);
            // Assert
            expect(res.json.calledWith(validServiceResponse)).to.be.true;
        })

        it("should response with response code 201 if request is successful", async () => {
            userServices.loginUser.resolves(validServiceResponse)
            // Act
            await userController.loginUser(req, res);
            // Assert
            expect(res.status.calledWith(201)).to.be.true;
        }) 
    })
})
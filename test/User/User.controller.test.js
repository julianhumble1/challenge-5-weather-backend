import { expect } from "chai";
import sinon from "sinon";

import UserController from "../../src/controllers/User.controller.js";
import User from "../../src/models/User.model.js";
import UserValidator from "../../src/middleware/UserValidator.js";

describe("UserController tests", () => {
    describe("successful request tests", () => {

        let userController;
        let userServices;
        let req, res, next;
        let userValidatorStub;
        let newUser;

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
            res = {
                json: sinon.spy(),
                status: sinon.stub().returnsThis()
            }
            next = sinon.spy();
            userValidatorStub = sinon.stub(UserValidator, "handleValidationErrors").callsFake((req, res, next) => next)

            newUser = {
                    "email": "user@example.com",
                    "password": "password1!",
                    "favouriteLocations": [],
                    "_id": "666eecdb4463cfb7134ef2ac",
                    "__v": 0
            }
        })

        afterEach(() => {
            sinon.restore();
        })

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
})
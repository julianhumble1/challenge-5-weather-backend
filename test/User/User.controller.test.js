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

    afterEach(() => {
        sinon.restore();
    })

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

        const validServiceResponse = {
            email: "email1@email.com",
            password: "password1!",
            accessToken: "validToken"
        }
        
        const invalidServiceResponse = {
            accessToken: null
        }

        afterEach(() => {
            sinon.restore();
        })

        it("should respond with details and access token if request is successful", async () => {
            // Arrange
            userServices.loginUser.resolves(validServiceResponse)
            // Act
            await userController.loginUser(req, res);
            // Assert
            expect(res.json.calledWith(validServiceResponse)).to.be.true;
        })

        it("should response with response code 201 if request is successful", async () => {
            // Arrange
            userServices.loginUser.resolves(validServiceResponse)
            // Act
            await userController.loginUser(req, res);
            // Assert
            expect(res.status.calledWith(201)).to.be.true;
        }) 

        it("should respond with with response code 401 if password does not match email", async () => {
            // Arrange
            userServices.loginUser.resolves(invalidServiceResponse)
            // Act
            await userController.loginUser(req, res);
            // Assert
            expect(res.status.calledWith(401)).to.be.true;
        })

        it("should respond with response code 404 if user is not in database", async () => {
            // Arrange
            userServices.loginUser.rejects(new Error("User not found in database"))
            // Act
            await userController.loginUser(req, res);
            // Assert
            expect(res.status.calledWith(404)).to.be.true;
        })

        it("should respond with response code 500 if it fails to make query to database", async () => {
            // Arrange
            userServices.loginUser.rejects(new Error("Internal system error"))
            // Act
            await userController.loginUser(req, res);
            // Assert
            expect(res.status.calledWith(500)).to.be.true;
        })
    })

    describe("updatePassword tests", () => {

        beforeEach(() => {
            userServices = {
                updatePassword: sinon.stub()
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

        it("should respond with response code 500 if it fails to connect to database", async () => {
            // Arrange
            userServices.updatePassword.rejects(new Error("Internal system error"))
            // Act
            await userController.updatePassword(req, res)
            // Assert
            expect(res.status.calledWith(500)).to.be.true;
        })

        it("should respond with response code 404 if user is not in the database", async () => {
            // Arrange
            userServices.updatePassword.rejects(new Error("User not found in database"))
            // Act
            await userController.updatePassword(req, res)
            // Assert
            expect(res.status.calledWith(404)).to.be.true;
        })

        it("should respond with response code 401 if email and password don't match", async () => {
            // Arrange
            userServices.updatePassword.rejects(new Error("Email and password do not match"))
            // Act
            await userController.updatePassword(req, res)
            // Assert
            expect(res.status.calledWith(401)).to.be.true;
        })

        it("should respond with response code 200 if request is succesful", async () => {
            // Arrange
            userServices.updatePassword.resolves();
            // Act
            await userController.updatePassword(req, res)
            // Assert
            expect(res.status.calledWith(401)).to.be.true;
        })

    })

    describe("getFavLocations tests", async () => {
        beforeEach(() => {
            userServices = {
                getFavLocations: sinon.stub()
            }
            userController = new UserController(userServices)

            req = {
                body:
                    {"email": "user@example.com"}
            }     
            
            next = sinon.spy();
            userValidatorStub = sinon.stub(UserValidator, "handleValidationErrors").callsFake((req, res, next) => next)
        })

        it("should respond with code 500 if the service fails to connect to database", async () => {
            // Arrange
            userServices.getFavLocations.rejects(new Error("Internal system error"))
            // Act
            await userController.getFavLocations(req, res)
            // Assert
            expect(res.status.calledWith(500)).to.be.true;
        })

        it("should respond with code 404 if the user is not found in the database", async () => {
            // Arrange
            userServices.getFavLocations.rejects(new Error("User not found in database"))
            // Act
            await userController.getFavLocations(req, res)
            // Assert
            expect(res.status.calledWith(404)).to.be.true;
        })

        it("should respond with code 200 if the request is successful", async () => {
            // Arrange
            userServices.getFavLocations.resolves({
                favouriteLocations: []
            })
            // Act
            await userController.getFavLocations(req, res)
            // Assert
            expect(res.status.calledWith(200)).to.be.true;
        })

        it("should respond with favourite locations in the body if the request is successful", async () => {
            // Arrange
            userServices.getFavLocations.resolves({
                favouriteLocations: ["216574"]
            })
            // Act
            await userController.getFavLocations(req, res)
            // Assert
            expect(res.json.calledWith(["216574"])).to.be.true;
        })
    })

    describe("addFavLocation tests", () => {
        beforeEach(() => {
            userServices = {
                addFavLocation: sinon.stub()
            }
            userController = new UserController(userServices)

            req = {
                body:
                {
                    "email": "user@example.com",
                    "locationId": "1234567"
                }
            }     
            
            next = sinon.spy();
            userValidatorStub = sinon.stub(UserValidator, "handleValidationErrors").callsFake((req, res, next) => next)
        })

        it("should respond with code 500 if the service fails to connect to database", async () => {
            // Arrange
            userServices.addFavLocation.rejects(new Error("Internal system error"))
            // Act
            await userController.addFavLocation(req, res)
            // Assert
            expect(res.status.calledWith(500)).to.be.true;
        })

        it("should respond with code 404 if the user is not found in the database", async () => {
            // Arrange
            userServices.addFavLocation.rejects(new Error("User not found in database"))
            // Act
            await userController.addFavLocation(req, res)
            // Assert
            expect(res.status.calledWith(404)).to.be.true;
        })

        it("should respond with code 400 if location is already in favourites", async () => {
            // Arrange
            userServices.addFavLocation.rejects(new Error("Location already in favourites"))
            // Act
            await userController.addFavLocation(req, res)
            // Assert
            expect(res.status.calledWith(400)).to.be.true;
        })

        it("should respond with code 200 if request is successful", async () => {
            // Arrange
            userServices.addFavLocation.resolves()
            // Act
            await userController.addFavLocation(req, res)
            // Assert
            expect(res.status.calledWith(200)).to.be.true;
        })
    })

    describe("removeFavLocation tests", () => {
        beforeEach(() => {
            userServices = {
                removeFavLocation: sinon.stub()
            }
            userController = new UserController(userServices)

            req = {
                body:
                {
                    "email": "user@example.com",
                    "locationId": "1234567"
                }
            }     
            
            next = sinon.spy();
            userValidatorStub = sinon.stub(UserValidator, "handleValidationErrors").callsFake((req, res, next) => next)
         })
        
        it("should respond with code 500 if the service fails to connect to database", async () => {
            // Arrange
            userServices.removeFavLocation.rejects(new Error("Internal system error"))
            // Act
            await userController.removeFavLocation(req, res)
            // Assert
            expect(res.status.calledWith(500)).to.be.true;
        })

         it("should respond with code 404 if the user is not found in the database", async () => {
            // Arrange
            userServices.removeFavLocation.rejects(new Error("User not found in database"))
            // Act
            await userController.removeFavLocation(req, res)
            // Assert
            expect(res.status.calledWith(404)).to.be.true;
         })
        
        it("should respond with code 400 if location is already not in favourites", async () => {
            // Arrange
            userServices.removeFavLocation.rejects(new Error("Location already not in favourites"))
            // Act
            await userController.removeFavLocation(req, res)
            // Assert
            expect(res.status.calledWith(400)).to.be.true;
        })
        
        it("should respond with code 200 if request is successful", async () => {
            // Arrange
            userServices.removeFavLocation.resolves()
            // Act
            await userController.removeFavLocation(req, res)
            // Assert
            expect(res.status.calledWith(200)).to.be.true;
        })
    })
})
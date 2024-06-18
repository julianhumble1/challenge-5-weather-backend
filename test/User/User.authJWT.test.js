import authJWT from "../../src/middleware/authJWT.js"

import { expect } from "chai";
import sinon from "sinon"
import jwt from "jsonwebtoken"
import User from "../../src/models/User.model.js";


describe("authJWT tests", () => {
    let mockRequest;
    let mockResponse;
    let nextFunction;

    beforeEach(() => {
            mockRequest = {
                body: {
                    email: "user@example.com",
                    id: "666ebf51cdf1cff8e67b6fc4"
                },
                userId: "666ebf51cdf1cff8e67b6fc4"
            };
            mockResponse = {
                send: sinon.spy(),
                status: sinon.stub().returnsThis(),
            };
            nextFunction = sinon.spy();
        });
    
        afterEach(() => {
            sinon.restore();
        });

    describe("verifyToken tests", () => {
    
    
        it("should respond status code 403 if no token is provided", () => {
            // Arrange
            mockRequest.headers = {}
            // Act
            authJWT.verifyToken(mockRequest, mockResponse, nextFunction)
            // Assert
            expect(mockResponse.status.calledWith(403)).to.be.true;
        })
    
        it("should respond status code 401 if token provided is invalid", () => {
            // Arrange
            mockRequest.headers = { "x-access-token": "invalid token" }
            sinon.stub(jwt, "verify").callsFake((token, secret, callback) => {
                callback(new Error("Invalid token"), null)
            })
            // Act
            authJWT.verifyToken(mockRequest, mockResponse, nextFunction)
            // Assert
            expect(mockResponse.status.calledWith(401)).to.be.true;
        })
    
        it("should add decoded id to request header if token is valid", () => {
            // Arrange
            mockRequest.headers = { "x-access-token": "validToken" }
            const decodedToken = {
                "id": "123"
            }
            sinon.stub(jwt, "verify").callsFake((token, secret, callback) => {
                callback(null, decodedToken)
            })
            // Act
            authJWT.verifyToken(mockRequest, mockResponse, nextFunction)
            // Assert
            expect(mockRequest.userId).to.equal(decodedToken.id);
        })
    
        it("should call next function if token is valid", () => {
            // Arrange
            mockRequest.headers = { "x-access-token": "validToken" }
            const decodedToken = {
                "id": "123"
            }
            sinon.stub(jwt, "verify").callsFake((token, secret, callback) => {
                callback(null, decodedToken)
            })
            // Act
            authJWT.verifyToken(mockRequest, mockResponse, nextFunction)
            // Assert
            expect(nextFunction.called).to.be.true;
        })
    })

    describe("isCorrectId tests", () => {

        it("should respond status code 404 if request if user is not in database", async () => {
            // Arrange
            sinon.stub(User, "findOne").callsFake((email) => {null})
            // Act
            await authJWT.isCorrectId(mockRequest, mockResponse, nextFunction)
            // Assert
            expect(mockResponse.status.calledWith(404)).to.be.true;
        })

        it("should respond status code 500 if call to database fails", async() => {
            // Arrange
            sinon.stub(User, "findOne").rejects(new Error("failed to connect to database"))
            // Act
            await authJWT.isCorrectId(mockRequest, mockResponse, nextFunction)
            // Assert
            expect(mockResponse.status.calledWith(500)).to.be.true;
        })

        it("should respond status code 401 if user IDs do not match", async () => {
            // Arrange
            sinon.stub(User, "findOne").resolves({id:123})
            // Act
            await authJWT.isCorrectId(mockRequest, mockResponse, nextFunction)
            // Arrange
            expect(mockResponse.status.calledWith(401)).to.be.true;
        })

        it("should call next function if IDs match", async () => {
            // Arrange
            sinon.stub(User, "findOne").resolves({id:"666ebf51cdf1cff8e67b6fc4"})
            // Act
            await authJWT.isCorrectId(mockRequest, mockResponse, nextFunction)
            // Assert
            expect(nextFunction.called).to.be.true;
        })
    })
})
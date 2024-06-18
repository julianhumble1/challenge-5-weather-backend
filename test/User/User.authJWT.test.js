import authJWT from "../../src/middleware/authJWT.js"

import { expect } from "chai";
import sinon from "sinon"

describe("verifyToken tests", () => {

    let mockRequest;
    let mockResponse;
    let nextFunction;

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            send: sinon.spy(),
            status: sinon.stub().returnsThis()
        }
        nextFunction = sinon.spy();
    })

    it("should respond status code 403 if no token is provided", () => {
        // Arrange
        mockRequest.headers = {}
        // Act
        authJWT.verifyToken(mockRequest, mockResponse, nextFunction)
        // Assert
        expect(mockResponse.status.calledWith(403)).to.be.true;
    })

    it("should respond status code 401 if token provided is invalid", () => {
        
    })
})
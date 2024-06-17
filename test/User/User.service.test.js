import { expect } from "chai";
import sinon from "sinon";
import bcrypt from "bcrypt"

import User from "../../src/models/User.model.js";
import UserService from "../../src/services/User.service.js";

describe("User service tests", () => {
    let userService;
    beforeEach(() => {
        userService = new UserService()
    })
    describe("addNewUser service tests", () => {

        let userStub;
        let newUser;
        let saveStub
        let bcryptStub;

        beforeEach(() => {
            userStub = sinon.stub(User.prototype, "constructor").callsFake((newUser) => { { } })
            
            saveStub = sinon.stub(User.prototype, "save");

            bcryptStub = sinon.stub(bcrypt, "hashSync").returns("encryptedPassword")
            
            newUser = {"email": "user@example.com",
                        "password": "password1!"}
    
        })

        afterEach(() => {
            sinon.restore();
        })

        it("should call save and return the result when a valid User is added ", async () => {
            // Arrange
            const newUserDoc = {
                "email": "user@example.com",
                "password": "encryptedPassword",
            }

            saveStub.returns(newUserDoc)
            // Act
            const result = await userService.addNewUser(newUser)
            // Assert
            expect(result).to.contain(newUserDoc);
        })

        it("should throw an error when save fails", async () => {
            // Arrange
            const invalidUser = { email: "" };
            const error = new Error("Invalid user")
            saveStub.throws(error);

            // Act // Assert
            try {
                await userService.addNewUser(invalidUser);
                assert.fail("Expected error was not thrown")
            } catch (e) {
                expect(e).to.equal(error);
            }
            
        })
    })
})
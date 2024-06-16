import { expect } from "chai";
import sinon from "sinon";

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
        let saveStub;

        beforeEach(() => {
            userStub = sinon.stub(User.prototype, "constructor").callsFake((newUser) => {{}})

            saveStub = sinon.stub(User.prototype, "save")
            
            newUser = {"email": "user@example.com",
                        "password": "password1!"}
    
        })

        afterEach(() => {
            userStub.restore();
        })

        it("should call save and return the result when a valid User is added ", async () => {
            // Arrange
            const newUserDoc = {
                "email": "user@example.com",
                "password": "password1!",
                "favouriteLocations": [],
                "_id": "666eecdb4463cfb7134ef2ac",
                "__v": 0
            }

            saveStub.returns(newUserDoc)
            // Act
            const result = await userService.addNewUser(newUser)
            // Assert
            expect(result).to.equal(newUserDoc);
        })
    })
})
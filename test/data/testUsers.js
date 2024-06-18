import bcrypt from "bcrypt"

const hashPassword = async (password) => {
    return await bcrypt.hash(password, 8)
}

const generateTestData = async () => {
    return {
        testUsers: [
            {
                "_id": "666ebf51cdf1cff8e67b6fc4",
                "email": "user@example.com",
                "password": await hashPassword("password1!"),
                "favouriteLocations": ["2643743", "2643123"],
                "__v": 0
            },
    
            {
                "_id":  "666ec0cbcdf1cff8e67b6fc8",
                "email": "different@example.com",
                "password": await hashPassword("password1!"),
                "favouriteLocations": [],
                "__v": 0
            }
        ],
        newUser: {
            "email": "new@example.com",
            "password": "password1!",     
        },
        updateUser: {
            email: "user@example.com",
            oldPassword: "password1!",
            newPassword: "password2!"
        },
        getFavLocationsUser: {
            email: "user@example.com"
        }
    }
}

export default generateTestData;
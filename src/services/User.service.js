import User from "../models/User.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
export default class UserService {

    getUsers = async () => {
        return await User.find({})
    }

    addNewUser = async (newUser) => {
        let user;
        try {
            user = new User({
                email: newUser.email,
                password: bcrypt.hashSync(newUser.password, 8)
            })
        } catch (e) {
            throw new Error("Invalid new user");
        }
        return await user.save();
    }

    loginUser = async ({ email, password }) => {
        let user;
        try {
            user = await User.findOne({ email: email }) 
        } catch (e) {
            throw new Error("Internal system error")
        }

        if (!user) {
            throw new Error("User not found in database")
        }

        const passwordsMatch = bcrypt.compareSync(password, user.password);
        if (!passwordsMatch) {
            return {
                accessToken: null
            }
        }

        const token = jwt.sign({ id: user.id }, process.env.SECRET, { expiresIn: 86400 });
        return {
            id: user.id,
            email: user.email,
            accessToken: token
        }
    }

    updatePassword = async ({ email, oldPassword, newPassword }) => {
        let user;
        try {
            user = await User.findOne({ email: email }) 
        } catch (e) {
            throw new Error("Internal system error")
        }

        if (!user) {
            throw new Error("User not found in database")
        }

        const passwordsMatch = bcrypt.compareSync(oldPassword, user.password);
        if (!passwordsMatch) {
            throw new Error("Email and password do not match")
        } else {
            const hashedNewPassword = bcrypt.hashSync(newPassword, 8)
            user.password = hashedNewPassword;
            try {
                await user.save();
                return;
            } catch (e) {
                throw new Error("Internal system error")
            }
        }
    }

    getFavLocations = async ({ email }) => {
        let user;
        try {
            user = await User.findOne({email: email}, {"favouriteLocations": 1})
        } catch (e) {
            throw new Error("Internal system error")
        }

        if (!user) {
            throw new Error("User not found in database")
        } else {
            return user;
        }
    }

    addFavLocation = async ({ email, locationId }) => {
        let user;
        try {
            user = await User.findOne({ email: email }, {"favouriteLocations": 1})
        } catch (e) {
            throw new Error("Internal system error")
        }

        if (!user) {
            throw new Error("User not found in database")
        } 

        if (user.favouriteLocations.includes(locationId)) {
            throw new Error("Location already in favourites")
        } else {
            user.favouriteLocations.push(locationId);
        }
        try {
            await user.save();
            return
        } catch {
            throw new Error("Internal system error")
        }
    
    }

    removeFavLocation = async ({ email, locationId }) => {
        let user;
        try {
            user = await User.findOne({ email: email }, {"favouriteLocations": 1})
        } catch (e) {
            throw new Error("Internal system error")
        }

        if (!user) {
            throw new Error("User not found in database")
        } 

        if (!user.favouriteLocations.includes(locationId)) {
            throw new Error("Location already not in favourites")
        } else {
            const index = user.favouriteLocations.indexOf(locationId);
            user.favouriteLocations.splice(index, 1);
        }
        try {
            await user.save();
            return
        } catch {
            throw new Error("Internal system error")
        }
    }
}
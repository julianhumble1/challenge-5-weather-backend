import { Schema, model } from "mongoose";

const userSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    favouriteLocations: [{type: String}]
})

const User = model("User", userSchema);

export default User;
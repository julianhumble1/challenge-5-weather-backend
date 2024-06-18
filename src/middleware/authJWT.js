import jwt from "jsonwebtoken"
import User from "../models/User.model.js"

const verifyToken = (req, res, next) => {
    let token = req.headers()
}
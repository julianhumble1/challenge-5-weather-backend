import jwt from "jsonwebtoken"
import User from "../models/User.model.js";

class authJWT {

    static verifyToken = (req, res, next) => {
        let token = req.headers["x-access-token"]
    
        if (!token) {
            return res.status(403).send({ message: `No token provided` });
        }
    
        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).send({ message: `Unauthorised` });
            }
    
            req.userId = decoded.id;
            next();
        });
    }

    static isCorrectId = async (req, res, next) => {
        let user;
        try {
            user = await User.findOne({ email: req.body.email })
        } catch (e) {
            return res.status(500).send("Internal system error")
        }

        if (!user) {
            return res.status(400).send("User email not in database")
        }
        console.log(user.id)
        console.log(req.userId)
        if (user.id !== req.userId) {
            return res.status(401).send("Invalid token")
        } else {
            next();
            return;
        }
    }
}

export default authJWT
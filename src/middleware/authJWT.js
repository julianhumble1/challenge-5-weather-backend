import jwt from "jsonwebtoken"

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
}

export default authJWT
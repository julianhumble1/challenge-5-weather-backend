import * as expressValidator from "express-validator"

export default class UserValidator {
    static validateNewUser = () => {
        try {
            return [
                expressValidator.body("email")
                    .isEmail().withMessage("Invalid email format"),
                
                expressValidator.body("password")
                    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
                    .matches(/\d/).withMessage("Password must contain a number")
                    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage("Password must contain a special character")
            ]
        } catch (error) {
            console.log(error);
            return []
        }
    }
}
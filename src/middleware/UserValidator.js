import * as expressValidator from "express-validator"


export default class UserValidator {

    static validateEmail = () => {
        try {
            const errorsArray = [
                expressValidator.body("email")
                    .isEmail().withMessage("Invalid email format"),
            ]
            return errorsArray;
        } catch (error) {
            console.log(error);
            return []
        }
    }

    static validateEmailPassword = () => {
        try {
            const errorsArray = [
                expressValidator.body("email")
                    .isEmail().withMessage("Invalid email format"),
                
                expressValidator.body("password")
                    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
                    .matches(/\d/).withMessage("Password must contain a number")
                    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage("Password must contain a special character"),
            ]
            return errorsArray;
        } catch (error) {
            console.log(error);
            return []
        }
    }

    static validateEmailAndUpdatedPassword = () => {
        try {
            const errorsArray = [
                expressValidator.body("email")
                    .isEmail().withMessage("Invalid email format"),
                
                expressValidator.body("oldPassword")
                    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
                    .matches(/\d/).withMessage("Password must contain a number")
                    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage("Password must contain a special character"),
                expressValidator.body("newPassword")
                    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
                    .matches(/\d/).withMessage("Password must contain a number")
                    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage("Password must contain a special character")
            ]
            return errorsArray;
        } catch (error) {
            console.log(error);
            return []
        }
    }

    static handleValidationErrors = (req, res) => {
        try {
            const errors = expressValidator.validationResult(req);
            if (!errors.isEmpty()) {
                const extractedErrors = [];
                errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))
                res.status(400).json({
                    errors:extractedErrors
                })
                return true
            }
        } catch (error) {
            console.error(error);
            res.status(500).send("Server error")
            return
        }
    }
}
import { body } from "express-validator";

export const registerValidation = [
    body('email', 'Invalid mail format').isEmail(),
    body('password', 'Password must be at least five characters long').isLength({min: 5}),
    body('fullName', 'Name must contain at least three letters').isLength({min: 3})
]
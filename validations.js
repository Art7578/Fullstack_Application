import { body } from "express-validator";

export const registerValidation = [
    body('email', 'Invalid mail format').isEmail(),
    body('password', 'Password must be at least five characters long').isLength({min: 5}),
    body('fullName', 'Name must contain at least three letters').isLength({min: 3})
];

export const loginValidation = [
    body('email', 'Invalid mail format').isEmail(),
    body('password', 'Password must be at least five characters long').isLength({min: 5})
];

export const postCreateValidation = [
    body('title', 'Enter article title').isLength({min: 3}).isString(),
    body('text', 'Enter the text of the article').isLength({min: 10}).isString(),
    body('tags', 'Invalid tag format (specify array)').optional().isArray(),
    body('imageUrl', 'Invalid image link').optional().isString(),
];
import express from 'express';
import dotenv from "dotenv";
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';

import { registerValidation, loginValidation, postCreateValidation } from './validations.js';
import {checkAuth, handleErrors} from './utils/index.js';
import { UserController, PostController } from './controllers/index.js';

dotenv.config();
const {DB_HOST, PORT} = process.env;

mongoose
    .connect(DB_HOST)
    .then(() => console.log("Database connection successful"))
    .catch((err) => console.log("DB error", err));

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({storage});

app.use(express.json());
app.use(cors());
app.use('/upload', express.static('uploads'));

app.post('/auth/register', registerValidation, handleErrors, UserController.register);
app.post('/auth/login', loginValidation, handleErrors, UserController.login);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req,res) => {
    res.json({
        url: `/upload/${req.file.originalname}`,
    });
});

app.post('/posts', 
    checkAuth, 
    postCreateValidation, 
    handleErrors, 
    PostController.create);
app.get('/posts', PostController.getAll);
app.get('/posts/tags', PostController.getLastTags);
app.get('/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', 
    checkAuth, 
    postCreateValidation,
    handleErrors,
    PostController.update);

app.listen(PORT, (err) => {
    if(err) {
        return console.log(err);
    }
    console.log("Connection successful");
});
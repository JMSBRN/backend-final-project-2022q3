import express from 'express';
import * as authContollers from '../controllers/authContollers'

const jsonParser = express.json();

const authRouter = express.Router();

authRouter.post('/signin', jsonParser, authContollers.signIn);
authRouter.post('/signup', jsonParser, authContollers.signUp);
authRouter.get('/check', authContollers.chek);

export default authRouter;
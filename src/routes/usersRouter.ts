import express from 'express';
import * as usersContollers from '../controllers/usersContollers'

const jsonParser = express.json();


const usersRouter = express.Router();

usersRouter.get('/', usersContollers.getUsers);

usersRouter.get('/:id', usersContollers.getUserById);

usersRouter.put('/:id', jsonParser, usersContollers.updateUser);

usersRouter.delete('/:id', usersContollers.deleteUser);

export default usersRouter;
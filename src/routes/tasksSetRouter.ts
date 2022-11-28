import express from 'express';
import * as tasksSetContollers from '../controllers/tasksSetContollers'

const jsonParser = express.json();


const tasksSetRouter = express.Router();

tasksSetRouter.patch('/', jsonParser, tasksSetContollers.updateSetOfTask);

tasksSetRouter.get('/', tasksSetContollers.findTasks);

tasksSetRouter.get('/:boardId', tasksSetContollers.getTasksByBoard);

export default tasksSetRouter;
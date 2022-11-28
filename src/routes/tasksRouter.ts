import express from 'express';
import * as tasksContollers from '../controllers/tasksContollers'

const jsonParser = express.json();


const tasksRouter = express.Router();

tasksRouter.get('/', tasksContollers.getTasks);

tasksRouter.get('/:taskId', tasksContollers.getTaskById);

tasksRouter.post('/', jsonParser, tasksContollers.createTask);

tasksRouter.put('/:taskId', jsonParser, tasksContollers.updateTask);

tasksRouter.delete('/:taskId', tasksContollers.deleteTask);

export default tasksRouter;
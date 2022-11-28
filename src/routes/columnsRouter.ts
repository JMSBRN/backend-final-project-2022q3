import express from 'express';
import * as columnsContollers from '../controllers/columnsContollers'
import tasksRouter from './tasksRouter';

const jsonParser = express.json();


const columnsRouter = express.Router();
columnsRouter.use('/:columnId/tasks', tasksRouter);

columnsRouter.get('/', columnsContollers.getColumns);

columnsRouter.get('/:columnId', columnsContollers.getColumnById);

columnsRouter.post('/', jsonParser, columnsContollers.createColumn);

columnsRouter.put('/:columnId', jsonParser, columnsContollers.updateColumn);

columnsRouter.delete('/:columnId', columnsContollers.deleteColumn);

export default columnsRouter;
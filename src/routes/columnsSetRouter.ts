import express from 'express';
import * as columnsSetContollers from '../controllers/columnsSetContollers'

const jsonParser = express.json();


const columnsSetRouter = express.Router();


columnsSetRouter.get('/', columnsSetContollers.findColumns);

columnsSetRouter.patch('/', jsonParser, columnsSetContollers.updateSetOfColumns);

columnsSetRouter.post('/', jsonParser, columnsSetContollers.createSetOfColumns);

export default columnsSetRouter;
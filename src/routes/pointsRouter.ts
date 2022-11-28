import express from 'express';
import * as pointsContollers from '../controllers/pointsContollers'

const jsonParser = express.json();


const pointsRouter = express.Router();


pointsRouter.get('/', pointsContollers.findPoints);

pointsRouter.get('/:taskId', pointsContollers.getPoints);

pointsRouter.post('/', jsonParser, pointsContollers.createPoint);

pointsRouter.patch('/', jsonParser, pointsContollers.updateSetOfPoints);

pointsRouter.patch('/:pointId', jsonParser, pointsContollers.updatePoint);

pointsRouter.delete('/:pointId', pointsContollers.deletePoint);

export default pointsRouter;
import express from 'express';
import * as boardsSetContollers from '../controllers/boardsSetContollers'


const boardsSetRouter = express.Router();

boardsSetRouter.get('/', boardsSetContollers.getBoardsByIds);

boardsSetRouter.get('/:userId', boardsSetContollers.getBoardsByUser);

export default boardsSetRouter;
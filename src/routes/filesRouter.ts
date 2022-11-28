import express from 'express';
import * as filesContollers from '../controllers/filesContollers'
import { upload } from '../middleWares/upload';

const filesRouter = express.Router();

filesRouter.get('/:taskId/:fileName', filesContollers.getFile);

filesRouter.get('/', filesContollers.findFiles);

filesRouter.get('/:boardId', filesContollers.getFilesByBoard);

filesRouter.post('/', upload.single('file'), filesContollers.uploadFile);

filesRouter.delete('/:fileId', filesContollers.deleteFile);

export default filesRouter;
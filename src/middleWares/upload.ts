import multer from 'multer';
import fs from 'fs';
import { checkBody } from '../services/error.service';
import * as fileService from '../services/file.service';

const storage = multer.diskStorage({
  destination: (req, file, next) => {
    fs.mkdir('files/', (err) => {
      next(null, 'files/')
    });

  },
  filename: (req, fileFromReq, next) => {
    const taskId = req.body.taskId
    const { originalname } = fileFromReq;
    next(null, `${taskId}-${originalname}`);
  }
})
export const upload = multer({
  storage: storage,
  fileFilter: async (req, fileFromReq, next) => {
    if (fileFromReq.mimetype == 'image/png' || fileFromReq.mimetype == 'image/jpeg') {
      const taskId = req.body.taskId;
      const boardId = req.body.boardId;
      const name = fileFromReq.originalname;
      const path = `files/${taskId}-${name}`
      const existFile = await fileService.findOneFile({ taskId, name });
      if (existFile) {
        req.params.error = "File already exist";
        next(null, false);
      }
      const guid = req.header('Guid') || 'undefined';
      const initUser = req.header('initUser') || 'undefined';
      const newFile = await fileService.createFile({ taskId, name, path, boardId }, guid, initUser);
      req.params.fileId = newFile._id;
      next(null, true)
    } else {
      req.params.error = "Incorrect file extension";
      next(null, false);
    }

  }
})
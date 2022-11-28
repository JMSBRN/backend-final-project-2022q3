import { Response, Request } from 'express';
import { createError } from '../services/error.service';
import fs from 'fs';
import * as fileService from '../services/file.service';
import * as boardService from '../services/board.service';



export const getFile = async (req: Request, res: Response) => {
  const path = `files/${req.params.taskId}-${req.params.fileName}`
  fs.readFile(path, (err, file) => {
    if (err) {
      return res.status(404).send(createError(404, "file not founded"));
    }
    res.setHeader('Content-Type', 'image/jpeg');
    res.send(file)
  });
};

export const getFilesByBoard = async (req: Request, res: Response) => {
  const boardId = req.params.boardId;
  try {
    const files = await fileService.findFiles({ boardId });
    res.json(files);
  } catch (error) {

  }
};

export const findFiles = async (req: Request, res: Response) => {
  const boards = await boardService.getBordsIdsByUserId(req.query.userId as string);
  const ids = req.query.ids as string[];
  const taskId = req.query.taskId as string;
  const allFiles = await fileService.findFiles({});
  if (ids) {
    return res.json(allFiles.filter(item => ids.includes(item._id)));
  } else if (taskId) {
    return res.json(allFiles.filter(oneFile => oneFile.taskId == taskId));
  } else if (boards) {
    return res.json(allFiles.filter(oneFile => boards.includes(oneFile.boardId)));
  } else {
    return res.status(400).send(createError(400, 'Bad request'));
  }
};

export const uploadFile = async (req: Request, res: Response) => {
  if (req.params.error === "file exist") {
    return res.status(402).send(createError(402, "file exist"));
  } else if (req.params.error === "file not allowed") {
    return res.status(400).send(createError(400, "only images"));
  } else if (req.params.error) {
    return res.status(400).send(createError(400, req.params.error));
  }
  return res.json(await fileService.getFileById(req.params.fileId));
};

export const deleteFile = async (req: Request, res: Response) => {
  const guid = req.header('Guid') || 'undefined';
  const initUser = req.header('initUser') || 'undefined';
  try {
    const deletedFile = await fileService.deleteFileById(req.params.fileId, guid, initUser);
    res.json(deletedFile);
  }
  catch (err) { return console.log(err); }
};


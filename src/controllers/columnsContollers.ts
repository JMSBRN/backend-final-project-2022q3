import { Response, Request } from 'express';
import * as columnService from '../services/column.service';
import { checkBody, createError } from '../services/error.service';


export const getColumns = async (req: Request, res: Response) => {
  const boardId = req.baseUrl.split('/')[2];
  try {
    const foundedColumns = await columnService.findColumns({ boardId });
    res.json(foundedColumns);
  } catch (err) {
    console.log(err);
  }
};

export const getColumnById = async (req: Request, res: Response) => {
  try {
    const foundedColumn = await columnService.findColumnById(req.params['columnId']);
    res.json(foundedColumn);
  }
  catch (err) {
    return res.status(404).send(createError(404, 'Column was not founded!'));
  }

};

export const createColumn = async (req: Request, res: Response) => {
  const guid = req.header('Guid') || 'undefined';
  const initUser = req.header('initUser') || 'undefined';
  const boardId = req.baseUrl.split('/')[2];
  const bodyError = checkBody(req.body, ['title', 'order'])
  if (bodyError) {
    return res.status(400).send(createError(400, "bad request: " + bodyError));
  }

  const { title, order } = req.body;

  try {
    const newColumn = await columnService.createColumn({ title, order, boardId }, guid, initUser);
    res.json(newColumn);
  }
  catch (err) { return console.log(err); }

};

export const updateColumn = async (req: Request, res: Response) => {
  const guid = req.header('Guid') || 'undefined';
  const initUser = req.header('initUser') || 'undefined';
  const bodyError = checkBody(req.body, ['title', 'order'])
  if (bodyError) {
    return res.status(400).send(createError(400, "bad request: " + bodyError));
  }
  const { title, order } = req.body;

  try {
    const updatedColumn = await columnService.updateColumn(req.params['columnId'], { title, order }, guid, initUser)
    res.json(updatedColumn);
  }
  catch (err) { return console.log(err); }
};

export const deleteColumn = async (req: Request, res: Response) => {
  const guid = req.header('Guid') || 'undefined';
  const initUser = req.header('initUser') || 'undefined';
  try {
    const deletedColumn = await columnService.deleteColumnById(req.params['columnId'], guid, initUser);
    res.json(deletedColumn);
  }
  catch (err) { return console.log(err); }
};
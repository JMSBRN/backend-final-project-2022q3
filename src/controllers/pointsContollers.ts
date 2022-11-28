import { Response, Request } from 'express';
import * as pointService from '../services/point.service';
import { checkBody, createError } from '../services/error.service';
import { socket } from '../services/server.service';
import * as boardService from '../services/board.service';



export const getPoints = async (req: Request, res: Response) => {
  const taskId = req.params['taskId'];
  try {
    const foundedPoints = await pointService.findPoints({ taskId });
    res.json(foundedPoints);
  } catch (err) {
    console.log(err);
  }
};

export const findPoints = async (req: Request, res: Response) => {
  const boards = await boardService.getBordsIdsByUserId(req.query.userId as string);
  const ids = req.query.ids as string[];
  if (ids) {
    const allPoints = await pointService.findPoints({});
    return res.json(allPoints.filter(item => ids.includes(item._id)));
  } else if (boards) {
    const allPoints = await pointService.findPoints({});
    return res.json(allPoints.filter(onePoint => boards.includes(onePoint.boardId)));
  } else {
    return res.status(400).send(createError(400, 'Bad request'));
  }
};

export const createPoint = async (req: Request, res: Response) => {
  const guid = req.header('Guid') || 'undefined';
  const initUser = req.header('initUser') || 'undefined';

  const bodyError = checkBody(req.body, ['title', 'taskId', 'boardId', 'done']);
  if (bodyError) {
    return res.status(400).send(createError(400, "bad request: " + bodyError));
  }

  const { title, taskId, boardId, done } = req.body;
  try {
    const newPoint = await pointService.createPoint({ title, taskId, boardId, done }, guid, initUser);
    res.json(newPoint);
  }
  catch (err) { return console.log(err); }

};

export const updatePoint = async (req: Request, res: Response) => {
  const guid = req.header('Guid') || 'undefined';
  const initUser = req.header('initUser') || 'undefined';
  const bodyError = checkBody(req.body, ['title', 'done']);
  if (bodyError) {
    return res.status(400).send(createError(400, "bad request: " + bodyError));
  }
  const { title, done } = req.body;

  try {
    const updatedPoint = await pointService.updatePoint(req.params.pointId, { title, done }, guid, initUser);
    res.json(updatedPoint);
  }
  catch (err) { return console.log(err); }
};

export const updateSetOfPoints = async (req: Request, res: Response) => {
  const guid = req.header('Guid') || 'undefined';
  const initUser = req.header('initUser') || 'undefined';
  const points = req.body;

  if (points.length == 0) {
    return res.status(400).send(createError(400, 'You need at least 1 point'));
  }

  const updatedPoints = [];
  for (const onePoint of points) {
    const pointError = checkBody(onePoint, ['_id', 'done'])
    if (pointError) {
      return res.status(400).send(createError(400, pointError));
    }
    const { _id, done } = onePoint;

    const foundedPoints = await pointService.findPointById(_id);

    if (!foundedPoints) {
      return res.status(404).send(createError(404, 'Point was not founded!'));
    }
    try {
      updatedPoints.push(await pointService.updatePoint(_id, { done }, guid, initUser, false));
    }
    catch (err) { return console.log(err); }

  }
  socket.emit('points', {
    action: 'update',
    users: await boardService.getUserIdsByBoardsIds(updatedPoints.map(item => item.boardId)),
    ids: updatedPoints.map(item => item._id),
    guid,
    notify: false,
    initUser,
  });
  return res.json(updatedPoints);
};

export const deletePoint = async (req: Request, res: Response) => {
  const guid = req.header('Guid') || 'undefined';
  const initUser = req.header('initUser') || 'undefined';
  try {
    const deletedPoint = await pointService.deletePointById(req.params.pointId, guid, initUser);
    res.json(deletedPoint);
  }
  catch (err) { return console.log(err); }
};

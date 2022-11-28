import { Response, Request } from 'express';
import * as columnService from '../services/column.service';
import { checkBody, createError } from '../services/error.service';
import { socket } from '../services/server.service';
import * as boardService from '../services/board.service';

export const updateSetOfColumns = async (req: Request, res: Response) => {
  const guid = req.header('Guid') || 'undefined';
  const initUser = req.header('initUser') || 'undefined';
  const columns = req.body;
  if (columns.length == 0) {
    return res.status(400).send(createError(400, 'You need at least 1 column'));
  }
  const updatedColumns = [];
  for (const oneColumn of columns) {
    const columnError = checkBody(oneColumn, ['_id', 'order'])
    if (columnError) {
      return res.status(400).send(createError(400, columnError));
    }
    const { _id, order } = oneColumn;

    const foundedColumns = await columnService.findColumnById(_id);
    if (!foundedColumns) {
      return res.status(404).send(createError(404, 'Column was not founded!'));
    }
    try {
      updatedColumns.push(await columnService.updateColumn(_id, { order }, guid, initUser, false));
    }
    catch (err) { return console.log(err); }

  }
  socket.emit('columns', {
    action: 'update',
    users: await boardService.getUserIdsByBoardsIds(updatedColumns.map(item => item.boardId)),
    ids: updatedColumns.map(item => item._id),
    guid,
    notify: false,
    initUser,
  });
  return res.json(updatedColumns);
};

export const findColumns = async (req: Request, res: Response) => {
  const boards = await boardService.getBordsIdsByUserId(req.query.userId as string);
  const ids = req.query.ids as string[];
  if (ids) {
    const allColumns = await columnService.findColumns({});
    return res.json(allColumns.filter(item => ids.includes(item._id)));
  } else if (boards) {
    const allColumns = await columnService.findColumns({});
    return res.json(allColumns.filter(oneColumn => boards.includes(oneColumn.boardId)));
  } else {
    return res.status(400).send(createError(400, 'Bad request'));
  }
};

export const createSetOfColumns = async (req: Request, res: Response) => {
  const guid = req.header('Guid') || 'undefined';
  const initUser = req.header('initUser') || 'undefined';
  const columns = req.body;
  if (columns.length == 0) {
    return res.status(400).send(createError(400, 'You need at least 1 column'));
  }
  const createdColumns = [];
  for (const oneColumn of columns) {
    const bodyError = checkBody(oneColumn, ['title', 'order', 'boardId'])
    if (bodyError) {
      return res.status(400).send(createError(400, "bad request: " + bodyError));
    }
    const { title, order, boardId } = oneColumn;

    try {
      createdColumns.push(await columnService.createColumn({ title, order, boardId }, guid, initUser, false));
    }
    catch (err) { return console.log(err); }
  }

  socket.emit('columns', {
    action: 'add',
    users: await boardService.getUserIdsByBoardsIds(createdColumns.map(item => item.boardId)),
    ids: createdColumns.map(item => item._id),
    guid,
    notify: true,
    initUser,
  });

  return res.json(createdColumns);

};


import column from '../models/column';
import { ObjectId } from 'mongodb';
import * as taskService from './task.service';
import * as boardService from './board.service';
import { socket } from './server.service';

export const createColumn = async (params: any, guid: string, initUser: string, emit = true, notify = true) => {
  const newColumn = new column(params);
  await newColumn.save();
  if (emit) {
    socket.emit('columns', {
      action: 'add',
      users: await boardService.getUserIdsByBoardsIds([newColumn.boardId]),
      ids: [newColumn._id],
      guid,
      notify,
      initUser
    });
  }
  return newColumn;
}

export const findOneColumn = (params: any) => {
  return column.findOne(params);
}

export const findColumnById = (id: string) => {
  return column.findById(new ObjectId(id));
}

export const findColumns = (params: any) => {
  return column.find(params);
}

export const updateColumn = async (id: string, params: any, guid: string, initUser: string, emit = true, notify = true) => {
  const columnId = new ObjectId(id);
  const updatedColumn = await column.findByIdAndUpdate(columnId, params, { new: true })
  if (emit) {
    socket.emit('columns', {
      action: 'update',
      users: await boardService.getUserIdsByBoardsIds([updatedColumn.boardId]),
      ids: [updatedColumn._id],
      guid,
      notify,
      initUser
    });
  }
  return updatedColumn;
}

export const deleteColumnById = async (columnId: string, guid: string, initUser: string, emit = true, notify = true) => {
  const id = new ObjectId(columnId);
  const deletedColumn = await column.findByIdAndDelete(id);
  await taskService.deleteTaskByParams({ columnId }, guid, initUser);
  if (emit) {
    socket.emit('columns', {
      action: 'delete',
      users: await boardService.getUserIdsByBoardsIds([deletedColumn.boardId]),
      ids: [deletedColumn._id],
      guid,
      notify,
      initUser
    });
  }
  return deletedColumn;
}

export const deleteColumnByParams = async (params: any, guid: string, initUser: string) => {
  const columns = await column.find(params);
  const deletedColumns = [];
  for (const onColumn of columns) {
    deletedColumns.push(await deleteColumnById(onColumn._id, guid, initUser, false));
  }
  socket.emit('columns', {
    action: 'delete',
    users: await boardService.getUserIdsByBoardsIds(deletedColumns.map(item => item.boardId)),
    ids: deletedColumns.map(item => item._id),
    guid: 'doesnt metter',
    notify: false,
    initUser,
  });
}

import board from '../models/board';
import { ObjectId } from 'mongodb';
import * as columnService from './column.service';
import { socket } from './server.service';

export const createBoard = async (params: any, guid: string, initUser: string, emit = true, notify = true) => {
  const newBoard = new board(params);
  await newBoard.save();
  if (emit) {
    socket.emit('boards', {
      action: 'add',
      users: [params.owner, ...params.users],
      ids: [newBoard._id],
      guid,
      notify,
      initUser
    });
  }
  return newBoard;
}

export const findBoardById = (id: string) => {
  return board.findById(new ObjectId(id));
}

export const findBoards = () => {
  return board.find({});
}

export const findBoardsByUser = async (userId: string) => {
  const allBoards = await board.find({});
  return allBoards.filter(item => item.owner === userId || item.users.includes(userId))
}

export const updateBoard = async (id: string, params: any, guid: string, initUser: string, emit = true, notify = true) => {
  const boardId = new ObjectId(id);
  const oldVersion = await findBoardById(id);
  const deletedUsers = oldVersion.users.filter((user: string) => !params.users.includes(user));
  const updatedBoard = await board.findByIdAndUpdate(boardId, params, { new: true });
  if (emit) {
    socket.emit('boards', {
      action: 'update',
      users: await getUserIdsByBoardsIds([updatedBoard._id]),
      ids: [updatedBoard._id],
      guid,
      notify,
      initUser
    });
  }
  if (deletedUsers.length > 0) {
    socket.emit('boards', {
      action: 'delete',
      users: deletedUsers,
      ids: [updatedBoard._id],
      guid,
      notify,
      initUser
    });
  }
  return updatedBoard;
}

export const deleteBoardById = async (boardId: string, guid: string, initUser: string, emit = true, notify = true) => {
  const id = new ObjectId(boardId);
  const deletedBoard = await board.findByIdAndDelete(id);
  const users = [...deletedBoard.users, deletedBoard.owner]
  await columnService.deleteColumnByParams({ boardId }, guid, initUser);
  if (emit) {
    socket.emit('boards', {
      action: 'delete',
      users,
      ids: [deletedBoard._id],
      guid,
      notify,
      initUser
    });
  }
  return deletedBoard;
}

export const deleteBoardByParams = async (params: any, guid: string, initUser: string) => {
  const boards = await board.find(params);
  const deletedBoards = [];
  for (const onBoard of boards) {
    deletedBoards.push(await deleteBoardById(onBoard._id, guid, initUser, false));
  }
  let users: string[] = [];
  deletedBoards.forEach(board => users = [...users, ...board.users, board.owner])
  socket.emit('boards', {
    action: 'delete',
    users: await getUserIdsByBoardsIds(deletedBoards.map(item => item._id)),
    ids: deletedBoards.map(item => item._id),
    guid,
    notify: true,
    initUser,
  });
}

export const clearUserInBoards = async (userId: string, guid: string, initUser: string) => {
  const boards = await board.find({});
  const clearedBoards = [];
  for (const onBoard of boards) {
    const userIndex = onBoard.users.findIndex((item: string) => item == userId)
    if (userIndex > 0) {
      onBoard.users.splice(userIndex, 1);
      clearedBoards.push(await updateBoard(onBoard._id, { users: onBoard.users }, guid, initUser, false));
    }
  }
  socket.emit('boards', {
    action: 'update',
    users: await getUserIdsByBoardsIds(clearedBoards.map(item => item._id)),
    ids: clearedBoards.map(item => item._id),
    guid,
    notify: false,
    initUser,
  });
}

export const getUserIdsByBoardsIds = async (boards: string[]) => {
  const allboards = await board.find({});
  const interestedBoards = allboards.filter(item => boards.includes(item._id.toString()));
  let result: string[] = [];
  for (const oneBoard of interestedBoards) {
    result = [...result, ...oneBoard.users, oneBoard.owner];
  }
  return Array.from(new Set(result));
}

export const getBordsIdsByUserId = async (user: string) => {
  const allboards = await board.find({});
  const interestedBoards = allboards.filter(item => item._doc.users.includes(user) || item._doc.owner === user);
  return interestedBoards.map(board => board._id.toString());
}

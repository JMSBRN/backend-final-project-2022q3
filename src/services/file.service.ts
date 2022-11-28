import file from '../models/file';
import fs from 'fs';
import { ObjectId } from 'mongodb';
import { socket } from './server.service';
import * as boardService from './board.service';

export const createFile = async (params: any, guid: string, initUser: string, emit = true, notify = true) => {
  const newFile = new file(params);
  await newFile.save();
  if (emit) {
    socket.emit('files', {
      action: 'add',
      users: await boardService.getUserIdsByBoardsIds([newFile.boardId]),
      ids: [newFile._id],
      guid,
      notify,
      initUser
    });
  }
  return newFile;
}

export const findOneFile = (params: any) => {
  return file.findOne(params);
}

export const getFileById = (id: string) => {
  return file.findById(new ObjectId(id));
}

export const findFiles = (params: any) => {
  return file.find(params);
}

export const deleteFileById = async (id: string, guid: string, initUser: string, emit = true, notify = true) => {
  const fileId = new ObjectId(id);
  const deletedFile = await file.findByIdAndDelete(fileId);
  fs.unlink(deletedFile.path, (err) => {
    if (err) console.log(err);
  });
  if (emit) {
    socket.emit('files', {
      action: 'delete',
      users: await boardService.getUserIdsByBoardsIds([deletedFile.boardId]),
      ids: [deletedFile._id],
      guid,
      notify,
      initUser
    });
  }
  return deletedFile;
}

export const deletedFilesByTask = async (taskId: string, guid: string, initUser: string) => {
  const files = await file.find({ taskId });
  const deletedFiles = [];
  for (const onFile of files) {
    deletedFiles.push(await deleteFileById(onFile._id, guid, initUser, false));
  }
  socket.emit('files', {
    action: 'delete',
    users: await boardService.getUserIdsByBoardsIds(deletedFiles.map(item => item.boardId)),
    ids: deletedFiles.map(item => item._id),
    guid: 'doesnt metter',
    notify: false,
    initUser,
  });
}
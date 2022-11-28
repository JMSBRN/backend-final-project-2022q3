"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletedFilesByTask = exports.deleteFileById = exports.findFiles = exports.getFileById = exports.findOneFile = exports.createFile = void 0;
const file_1 = __importDefault(require("../models/file"));
const fs_1 = __importDefault(require("fs"));
const mongodb_1 = require("mongodb");
const server_service_1 = require("./server.service");
const boardService = __importStar(require("./board.service"));
const createFile = (params, guid, initUser, emit = true, notify = true) => __awaiter(void 0, void 0, void 0, function* () {
    const newFile = new file_1.default(params);
    yield newFile.save();
    if (emit) {
        server_service_1.socket.emit('files', {
            action: 'add',
            users: yield boardService.getUserIdsByBoardsIds([newFile.boardId]),
            ids: [newFile._id],
            guid,
            notify,
            initUser
        });
    }
    return newFile;
});
exports.createFile = createFile;
const findOneFile = (params) => {
    return file_1.default.findOne(params);
};
exports.findOneFile = findOneFile;
const getFileById = (id) => {
    return file_1.default.findById(new mongodb_1.ObjectId(id));
};
exports.getFileById = getFileById;
const findFiles = (params) => {
    return file_1.default.find(params);
};
exports.findFiles = findFiles;
const deleteFileById = (id, guid, initUser, emit = true, notify = true) => __awaiter(void 0, void 0, void 0, function* () {
    const fileId = new mongodb_1.ObjectId(id);
    const deletedFile = yield file_1.default.findByIdAndDelete(fileId);
    fs_1.default.unlink(deletedFile.path, (err) => {
        if (err)
            console.log(err);
    });
    if (emit) {
        server_service_1.socket.emit('files', {
            action: 'delete',
            users: yield boardService.getUserIdsByBoardsIds([deletedFile.boardId]),
            ids: [deletedFile._id],
            guid,
            notify,
            initUser
        });
    }
    return deletedFile;
});
exports.deleteFileById = deleteFileById;
const deletedFilesByTask = (taskId, guid, initUser) => __awaiter(void 0, void 0, void 0, function* () {
    const files = yield file_1.default.find({ taskId });
    const deletedFiles = [];
    for (const onFile of files) {
        deletedFiles.push(yield (0, exports.deleteFileById)(onFile._id, guid, initUser, false));
    }
    server_service_1.socket.emit('files', {
        action: 'delete',
        users: yield boardService.getUserIdsByBoardsIds(deletedFiles.map(item => item.boardId)),
        ids: deletedFiles.map(item => item._id),
        guid: 'doesnt metter',
        notify: false,
        initUser,
    });
});
exports.deletedFilesByTask = deletedFilesByTask;

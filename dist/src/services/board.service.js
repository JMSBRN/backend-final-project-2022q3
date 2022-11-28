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
exports.getBordsIdsByUserId = exports.getUserIdsByBoardsIds = exports.clearUserInBoards = exports.deleteBoardByParams = exports.deleteBoardById = exports.updateBoard = exports.findBoardsByUser = exports.findBoards = exports.findBoardById = exports.createBoard = void 0;
const board_1 = __importDefault(require("../models/board"));
const mongodb_1 = require("mongodb");
const columnService = __importStar(require("./column.service"));
const server_service_1 = require("./server.service");
const createBoard = (params, guid, initUser, emit = true, notify = true) => __awaiter(void 0, void 0, void 0, function* () {
    const newBoard = new board_1.default(params);
    yield newBoard.save();
    if (emit) {
        server_service_1.socket.emit('boards', {
            action: 'add',
            users: [params.owner, ...params.users],
            ids: [newBoard._id],
            guid,
            notify,
            initUser
        });
    }
    return newBoard;
});
exports.createBoard = createBoard;
const findBoardById = (id) => {
    return board_1.default.findById(new mongodb_1.ObjectId(id));
};
exports.findBoardById = findBoardById;
const findBoards = () => {
    return board_1.default.find({});
};
exports.findBoards = findBoards;
const findBoardsByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const allBoards = yield board_1.default.find({});
    return allBoards.filter(item => item.owner === userId || item.users.includes(userId));
});
exports.findBoardsByUser = findBoardsByUser;
const updateBoard = (id, params, guid, initUser, emit = true, notify = true) => __awaiter(void 0, void 0, void 0, function* () {
    const boardId = new mongodb_1.ObjectId(id);
    const oldVersion = yield (0, exports.findBoardById)(id);
    const deletedUsers = oldVersion.users.filter((user) => !params.users.includes(user));
    const updatedBoard = yield board_1.default.findByIdAndUpdate(boardId, params, { new: true });
    if (emit) {
        server_service_1.socket.emit('boards', {
            action: 'update',
            users: yield (0, exports.getUserIdsByBoardsIds)([updatedBoard._id]),
            ids: [updatedBoard._id],
            guid,
            notify,
            initUser
        });
    }
    if (deletedUsers.length > 0) {
        server_service_1.socket.emit('boards', {
            action: 'delete',
            users: deletedUsers,
            ids: [updatedBoard._id],
            guid,
            notify,
            initUser
        });
    }
    return updatedBoard;
});
exports.updateBoard = updateBoard;
const deleteBoardById = (boardId, guid, initUser, emit = true, notify = true) => __awaiter(void 0, void 0, void 0, function* () {
    const id = new mongodb_1.ObjectId(boardId);
    const deletedBoard = yield board_1.default.findByIdAndDelete(id);
    const users = [...deletedBoard.users, deletedBoard.owner];
    yield columnService.deleteColumnByParams({ boardId }, guid, initUser);
    if (emit) {
        server_service_1.socket.emit('boards', {
            action: 'delete',
            users,
            ids: [deletedBoard._id],
            guid,
            notify,
            initUser
        });
    }
    return deletedBoard;
});
exports.deleteBoardById = deleteBoardById;
const deleteBoardByParams = (params, guid, initUser) => __awaiter(void 0, void 0, void 0, function* () {
    const boards = yield board_1.default.find(params);
    const deletedBoards = [];
    for (const onBoard of boards) {
        deletedBoards.push(yield (0, exports.deleteBoardById)(onBoard._id, guid, initUser, false));
    }
    let users = [];
    deletedBoards.forEach(board => users = [...users, ...board.users, board.owner]);
    server_service_1.socket.emit('boards', {
        action: 'delete',
        users: yield (0, exports.getUserIdsByBoardsIds)(deletedBoards.map(item => item._id)),
        ids: deletedBoards.map(item => item._id),
        guid,
        notify: true,
        initUser,
    });
});
exports.deleteBoardByParams = deleteBoardByParams;
const clearUserInBoards = (userId, guid, initUser) => __awaiter(void 0, void 0, void 0, function* () {
    const boards = yield board_1.default.find({});
    const clearedBoards = [];
    for (const onBoard of boards) {
        const userIndex = onBoard.users.findIndex((item) => item == userId);
        if (userIndex > 0) {
            onBoard.users.splice(userIndex, 1);
            clearedBoards.push(yield (0, exports.updateBoard)(onBoard._id, { users: onBoard.users }, guid, initUser, false));
        }
    }
    server_service_1.socket.emit('boards', {
        action: 'update',
        users: yield (0, exports.getUserIdsByBoardsIds)(clearedBoards.map(item => item._id)),
        ids: clearedBoards.map(item => item._id),
        guid,
        notify: false,
        initUser,
    });
});
exports.clearUserInBoards = clearUserInBoards;
const getUserIdsByBoardsIds = (boards) => __awaiter(void 0, void 0, void 0, function* () {
    const allboards = yield board_1.default.find({});
    const interestedBoards = allboards.filter(item => boards.includes(item._id.toString()));
    let result = [];
    for (const oneBoard of interestedBoards) {
        result = [...result, ...oneBoard.users, oneBoard.owner];
    }
    return Array.from(new Set(result));
});
exports.getUserIdsByBoardsIds = getUserIdsByBoardsIds;
const getBordsIdsByUserId = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const allboards = yield board_1.default.find({});
    const interestedBoards = allboards.filter(item => item._doc.users.includes(user) || item._doc.owner === user);
    return interestedBoards.map(board => board._id.toString());
});
exports.getBordsIdsByUserId = getBordsIdsByUserId;

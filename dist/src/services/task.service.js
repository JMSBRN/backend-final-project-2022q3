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
exports.clearUserInTasks = exports.deleteTaskByParams = exports.deleteTaskById = exports.updateTask = exports.findTasks = exports.findTaskById = exports.findOneTask = exports.createTask = void 0;
const task_1 = __importDefault(require("../models/task"));
const mongodb_1 = require("mongodb");
const fileService = __importStar(require("../services/file.service"));
const pointService = __importStar(require("../services/point.service"));
const boardService = __importStar(require("./board.service"));
const server_service_1 = require("./server.service");
const createTask = (params, guid, initUser, emit = true, notify = true) => __awaiter(void 0, void 0, void 0, function* () {
    const newTask = new task_1.default(params);
    yield newTask.save();
    if (emit) {
        server_service_1.socket.emit('tasks', {
            action: 'add',
            users: yield boardService.getUserIdsByBoardsIds([newTask.boardId]),
            ids: [newTask._id],
            guid,
            notify,
            initUser
        });
    }
    return newTask;
});
exports.createTask = createTask;
const findOneTask = (params) => {
    return task_1.default.findOne(params);
};
exports.findOneTask = findOneTask;
const findTaskById = (id) => {
    return task_1.default.findById(new mongodb_1.ObjectId(id));
};
exports.findTaskById = findTaskById;
const findTasks = (params) => {
    return task_1.default.find(params);
};
exports.findTasks = findTasks;
const updateTask = (id, params, guid, initUser, emit = true, notify = true) => __awaiter(void 0, void 0, void 0, function* () {
    const taskId = new mongodb_1.ObjectId(id);
    const updatedTask = yield task_1.default.findByIdAndUpdate(taskId, params, { new: true });
    if (emit) {
        server_service_1.socket.emit('tasks', {
            action: 'update',
            users: yield boardService.getUserIdsByBoardsIds([updatedTask.boardId]),
            ids: [updatedTask._id],
            guid,
            notify,
            initUser
        });
    }
    return updatedTask;
});
exports.updateTask = updateTask;
const deleteTaskById = (taskId, guid, initUser, emit = true, notify = true) => __awaiter(void 0, void 0, void 0, function* () {
    const id = new mongodb_1.ObjectId(taskId);
    const deletedTask = yield task_1.default.findByIdAndDelete(id);
    fileService.deletedFilesByTask(taskId, guid, initUser);
    pointService.deletePointsByParams({ taskId }, guid, initUser);
    if (emit) {
        server_service_1.socket.emit('tasks', {
            action: 'delete',
            users: yield boardService.getUserIdsByBoardsIds([deletedTask.boardId]),
            ids: [deletedTask._id],
            guid,
            notify,
            initUser
        });
    }
    return deletedTask;
});
exports.deleteTaskById = deleteTaskById;
const deleteTaskByParams = (params, guid, initUser) => __awaiter(void 0, void 0, void 0, function* () {
    const tasks = yield task_1.default.find(params);
    const deletedTasks = [];
    for (const onTask of tasks) {
        deletedTasks.push(yield (0, exports.deleteTaskById)(onTask._id, guid, initUser, false));
    }
    server_service_1.socket.emit('tasks', {
        action: 'delete',
        users: yield boardService.getUserIdsByBoardsIds(deletedTasks.map(item => item.boardId)),
        ids: deletedTasks.map(item => item._id),
        guid: 'doesnt metter',
        notify: false,
        initUser,
    });
});
exports.deleteTaskByParams = deleteTaskByParams;
const clearUserInTasks = (userId, guid, initUser) => __awaiter(void 0, void 0, void 0, function* () {
    const tasks = yield task_1.default.find({});
    const clearedTasks = [];
    for (const onTask of tasks) {
        const userIndex = onTask.users.findIndex((item) => item == userId);
        if (userIndex > 0) {
            onTask.users.splice(userIndex, 1);
            clearedTasks.push(yield (0, exports.updateTask)(onTask._id, { users: onTask.users }, guid, initUser, false));
        }
    }
    server_service_1.socket.emit('tasks', {
        action: 'update',
        users: yield boardService.getUserIdsByBoardsIds(clearedTasks.map(item => item.boardId)),
        ids: clearedTasks.map(item => item._id),
        guid,
        notify: false,
        initUser,
    });
});
exports.clearUserInTasks = clearUserInTasks;

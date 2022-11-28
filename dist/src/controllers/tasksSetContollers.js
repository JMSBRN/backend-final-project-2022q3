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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTasksByBoard = exports.findTasks = exports.updateSetOfTask = void 0;
const mongodb_1 = require("mongodb");
const taskService = __importStar(require("../services/task.service"));
const userService = __importStar(require("../services/user.service"));
const boardService = __importStar(require("../services/board.service"));
const error_service_1 = require("../services/error.service");
const server_service_1 = require("../services/server.service");
const updateSetOfTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const guid = req.header('Guid') || 'undefined';
    const initUser = req.header('initUser') || 'undefined';
    const tasks = req.body;
    if (tasks.length == 0) {
        return res.status(400).send((0, error_service_1.createError)(400, 'You need at least 1 task'));
    }
    const updatedTasks = [];
    for (const oneTask of tasks) {
        const taskError = (0, error_service_1.checkBody)(oneTask, ['_id', 'order', 'columnId']);
        if (taskError) {
            return res.status(400).send((0, error_service_1.createError)(400, "bad request: " + taskError));
        }
        const { _id, order, columnId } = oneTask;
        const foundedTasks = yield taskService.findTaskById(_id);
        if (!foundedTasks) {
            return res.status(404).send((0, error_service_1.createError)(404, 'Task was not founded!'));
        }
        try {
            updatedTasks.push(yield taskService.updateTask(_id, { order, columnId }, guid, initUser, false));
        }
        catch (err) {
            return console.log(err);
        }
    }
    server_service_1.socket.emit('tasks', {
        action: 'update',
        users: yield boardService.getUserIdsByBoardsIds(updatedTasks.map(item => item.boardId)),
        ids: updatedTasks.map(item => item._id),
        guid,
        notify: false,
        initUser,
    });
    return res.json(updatedTasks);
});
exports.updateSetOfTask = updateSetOfTask;
const findTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const search = req.query.search;
    const boards = yield boardService.getBordsIdsByUserId(req.query.userId);
    const allTasks = yield taskService.findTasks({});
    const ids = req.query.ids;
    if (ids) {
        return res.json(allTasks.filter(item => ids.includes(item._id)));
    }
    else if (search) {
        try {
            const allUsers = yield userService.findUsers();
            return res.json(allTasks.filter(oneTask => {
                const searchRequest = search.toUpperCase();
                if (oneTask.title.toUpperCase().includes(searchRequest)) {
                    return true;
                }
                if (oneTask.description.toUpperCase().includes(searchRequest)) {
                    return true;
                }
                const users = [...allUsers.filter(user => user._id === new mongodb_1.ObjectId(oneTask.userId) || oneTask.users.includes(user._id))];
                for (const user of users) {
                    if (user.name.toUpperCase().includes(searchRequest)) {
                        return true;
                    }
                }
                return false;
            }));
        }
        catch (err) {
            return console.log(err);
        }
    }
    else if (boards) {
        return res.json(allTasks.filter(oneTask => boards.includes(oneTask.boardId)));
    }
    else {
        return res.status(400).send((0, error_service_1.createError)(400, 'Bad request'));
    }
});
exports.findTasks = findTasks;
const getTasksByBoard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const boardId = req.params.boardId;
    try {
        const foundedTasks = yield taskService.findTasks({ boardId });
        res.json(foundedTasks);
    }
    catch (err) {
        console.log(err);
    }
});
exports.getTasksByBoard = getTasksByBoard;

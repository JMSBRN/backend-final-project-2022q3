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
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTaskById = exports.getTasks = void 0;
const taskService = __importStar(require("../services/task.service"));
const error_service_1 = require("../services/error.service");
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const boardId = req.baseUrl.split('/')[2];
    const columnId = req.baseUrl.split('/')[4];
    try {
        const foundedTasks = yield taskService.findTasks({ boardId, columnId });
        res.json(foundedTasks);
    }
    catch (err) {
        console.log(err);
    }
});
exports.getTasks = getTasks;
const getTaskById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foundedTask = yield taskService.findTaskById(req.params['taskId']);
        res.json(foundedTask);
    }
    catch (err) {
        res.status(404).send((0, error_service_1.createError)(404, 'Task was not founded!'));
    }
});
exports.getTaskById = getTaskById;
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const guid = req.header('Guid') || 'undefined';
    const initUser = req.header('initUser') || 'undefined';
    const boardId = req.baseUrl.split('/')[2];
    const columnId = req.baseUrl.split('/')[4];
    const bodyError = (0, error_service_1.checkBody)(req.body, ['title', 'order', 'description', 'userId', 'users']);
    if (bodyError) {
        return res.status(400).send((0, error_service_1.createError)(400, "bad request: " + bodyError));
    }
    const { title, order, description, userId, users } = req.body;
    try {
        const newTask = yield taskService.createTask({ title, order, description, userId, boardId, columnId, users }, guid, initUser);
        res.json(newTask);
    }
    catch (err) {
        return console.log(err);
    }
});
exports.createTask = createTask;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const guid = req.header('Guid') || 'undefined';
    const initUser = req.header('initUser') || 'undefined';
    const bodyError = (0, error_service_1.checkBody)(req.body, ['title', 'order', 'description', 'userId', 'columnId', 'users']);
    if (bodyError) {
        return res.status(400).send((0, error_service_1.createError)(400, "bad request: " + bodyError));
    }
    const { title, order, description, userId, columnId, users } = req.body;
    try {
        const updatedTask = yield taskService.updateTask(req.params.taskId, { title, order, description, userId, columnId, users }, guid, initUser);
        res.json(updatedTask);
    }
    catch (err) {
        return console.log(err);
    }
});
exports.updateTask = updateTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const guid = req.header('Guid') || 'undefined';
    const initUser = req.header('initUser') || 'undefined';
    try {
        const deletedTask = yield taskService.deleteTaskById(req.params.taskId, guid, initUser);
        res.json(deletedTask);
    }
    catch (err) {
        return console.log(err);
    }
});
exports.deleteTask = deleteTask;

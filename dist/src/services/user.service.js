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
exports.deleteUserById = exports.updateUser = exports.findOneUser = exports.findUsers = exports.findUserById = exports.createUser = void 0;
const user_1 = __importDefault(require("../models/user"));
const mongodb_1 = require("mongodb");
const taskService = __importStar(require("./task.service"));
const boardService = __importStar(require("./board.service"));
const server_service_1 = require("./server.service");
const createUser = (params, emit = true) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = new user_1.default(params);
    yield newUser.save();
    if (emit) {
        server_service_1.socket.emit('users', {
            action: 'add',
            ids: [newUser._id]
        });
    }
    return newUser;
});
exports.createUser = createUser;
const findUserById = (id) => {
    return user_1.default.findById(new mongodb_1.ObjectId(id));
};
exports.findUserById = findUserById;
const findUsers = () => {
    return user_1.default.find({});
};
exports.findUsers = findUsers;
const findOneUser = (params) => {
    return user_1.default.findOne(params);
};
exports.findOneUser = findOneUser;
const updateUser = (id, params, emit = true) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = new mongodb_1.ObjectId(id);
    const updatedUser = yield user_1.default.findByIdAndUpdate(userId, params, { new: true });
    if (emit) {
        server_service_1.socket.emit('users', {
            action: 'update',
            ids: [updatedUser._id]
        });
    }
    return updatedUser;
});
exports.updateUser = updateUser;
const deleteUserById = (userId, guid, initUser, emit = true) => __awaiter(void 0, void 0, void 0, function* () {
    const id = new mongodb_1.ObjectId(userId);
    const deletedUser = yield user_1.default.findByIdAndDelete(id);
    taskService.deleteTaskByParams({ userId }, guid, initUser);
    boardService.deleteBoardByParams({ owner: userId }, guid, initUser);
    taskService.clearUserInTasks(userId, guid, initUser);
    if (emit) {
        server_service_1.socket.emit('users', {
            action: 'delete',
            ids: [deletedUser._id]
        });
    }
    return deletedUser;
});
exports.deleteUserById = deleteUserById;

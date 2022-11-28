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
exports.deleteColumnByParams = exports.deleteColumnById = exports.updateColumn = exports.findColumns = exports.findColumnById = exports.findOneColumn = exports.createColumn = void 0;
const column_1 = __importDefault(require("../models/column"));
const mongodb_1 = require("mongodb");
const taskService = __importStar(require("./task.service"));
const boardService = __importStar(require("./board.service"));
const server_service_1 = require("./server.service");
const createColumn = (params, guid, initUser, emit = true, notify = true) => __awaiter(void 0, void 0, void 0, function* () {
    const newColumn = new column_1.default(params);
    yield newColumn.save();
    if (emit) {
        server_service_1.socket.emit('columns', {
            action: 'add',
            users: yield boardService.getUserIdsByBoardsIds([newColumn.boardId]),
            ids: [newColumn._id],
            guid,
            notify,
            initUser
        });
    }
    return newColumn;
});
exports.createColumn = createColumn;
const findOneColumn = (params) => {
    return column_1.default.findOne(params);
};
exports.findOneColumn = findOneColumn;
const findColumnById = (id) => {
    return column_1.default.findById(new mongodb_1.ObjectId(id));
};
exports.findColumnById = findColumnById;
const findColumns = (params) => {
    return column_1.default.find(params);
};
exports.findColumns = findColumns;
const updateColumn = (id, params, guid, initUser, emit = true, notify = true) => __awaiter(void 0, void 0, void 0, function* () {
    const columnId = new mongodb_1.ObjectId(id);
    const updatedColumn = yield column_1.default.findByIdAndUpdate(columnId, params, { new: true });
    if (emit) {
        server_service_1.socket.emit('columns', {
            action: 'update',
            users: yield boardService.getUserIdsByBoardsIds([updatedColumn.boardId]),
            ids: [updatedColumn._id],
            guid,
            notify,
            initUser
        });
    }
    return updatedColumn;
});
exports.updateColumn = updateColumn;
const deleteColumnById = (columnId, guid, initUser, emit = true, notify = true) => __awaiter(void 0, void 0, void 0, function* () {
    const id = new mongodb_1.ObjectId(columnId);
    const deletedColumn = yield column_1.default.findByIdAndDelete(id);
    yield taskService.deleteTaskByParams({ columnId }, guid, initUser);
    if (emit) {
        server_service_1.socket.emit('columns', {
            action: 'delete',
            users: yield boardService.getUserIdsByBoardsIds([deletedColumn.boardId]),
            ids: [deletedColumn._id],
            guid,
            notify,
            initUser
        });
    }
    return deletedColumn;
});
exports.deleteColumnById = deleteColumnById;
const deleteColumnByParams = (params, guid, initUser) => __awaiter(void 0, void 0, void 0, function* () {
    const columns = yield column_1.default.find(params);
    const deletedColumns = [];
    for (const onColumn of columns) {
        deletedColumns.push(yield (0, exports.deleteColumnById)(onColumn._id, guid, initUser, false));
    }
    server_service_1.socket.emit('columns', {
        action: 'delete',
        users: yield boardService.getUserIdsByBoardsIds(deletedColumns.map(item => item.boardId)),
        ids: deletedColumns.map(item => item._id),
        guid: 'doesnt metter',
        notify: false,
        initUser,
    });
});
exports.deleteColumnByParams = deleteColumnByParams;

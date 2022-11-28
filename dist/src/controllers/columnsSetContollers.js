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
exports.createSetOfColumns = exports.findColumns = exports.updateSetOfColumns = void 0;
const columnService = __importStar(require("../services/column.service"));
const error_service_1 = require("../services/error.service");
const server_service_1 = require("../services/server.service");
const boardService = __importStar(require("../services/board.service"));
const updateSetOfColumns = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const guid = req.header('Guid') || 'undefined';
    const initUser = req.header('initUser') || 'undefined';
    const columns = req.body;
    if (columns.length == 0) {
        return res.status(400).send((0, error_service_1.createError)(400, 'You need at least 1 column'));
    }
    const updatedColumns = [];
    for (const oneColumn of columns) {
        const columnError = (0, error_service_1.checkBody)(oneColumn, ['_id', 'order']);
        if (columnError) {
            return res.status(400).send((0, error_service_1.createError)(400, columnError));
        }
        const { _id, order } = oneColumn;
        const foundedColumns = yield columnService.findColumnById(_id);
        if (!foundedColumns) {
            return res.status(404).send((0, error_service_1.createError)(404, 'Column was not founded!'));
        }
        try {
            updatedColumns.push(yield columnService.updateColumn(_id, { order }, guid, initUser, false));
        }
        catch (err) {
            return console.log(err);
        }
    }
    server_service_1.socket.emit('columns', {
        action: 'update',
        users: yield boardService.getUserIdsByBoardsIds(updatedColumns.map(item => item.boardId)),
        ids: updatedColumns.map(item => item._id),
        guid,
        notify: false,
        initUser,
    });
    return res.json(updatedColumns);
});
exports.updateSetOfColumns = updateSetOfColumns;
const findColumns = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const boards = yield boardService.getBordsIdsByUserId(req.query.userId);
    const ids = req.query.ids;
    if (ids) {
        const allColumns = yield columnService.findColumns({});
        return res.json(allColumns.filter(item => ids.includes(item._id)));
    }
    else if (boards) {
        const allColumns = yield columnService.findColumns({});
        return res.json(allColumns.filter(oneColumn => boards.includes(oneColumn.boardId)));
    }
    else {
        return res.status(400).send((0, error_service_1.createError)(400, 'Bad request'));
    }
});
exports.findColumns = findColumns;
const createSetOfColumns = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const guid = req.header('Guid') || 'undefined';
    const initUser = req.header('initUser') || 'undefined';
    const columns = req.body;
    if (columns.length == 0) {
        return res.status(400).send((0, error_service_1.createError)(400, 'You need at least 1 column'));
    }
    const createdColumns = [];
    for (const oneColumn of columns) {
        const bodyError = (0, error_service_1.checkBody)(oneColumn, ['title', 'order', 'boardId']);
        if (bodyError) {
            return res.status(400).send((0, error_service_1.createError)(400, "bad request: " + bodyError));
        }
        const { title, order, boardId } = oneColumn;
        try {
            createdColumns.push(yield columnService.createColumn({ title, order, boardId }, guid, initUser, false));
        }
        catch (err) {
            return console.log(err);
        }
    }
    server_service_1.socket.emit('columns', {
        action: 'add',
        users: yield boardService.getUserIdsByBoardsIds(createdColumns.map(item => item.boardId)),
        ids: createdColumns.map(item => item._id),
        guid,
        notify: true,
        initUser,
    });
    return res.json(createdColumns);
});
exports.createSetOfColumns = createSetOfColumns;

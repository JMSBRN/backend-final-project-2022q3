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
exports.deleteColumn = exports.updateColumn = exports.createColumn = exports.getColumnById = exports.getColumns = void 0;
const columnService = __importStar(require("../services/column.service"));
const error_service_1 = require("../services/error.service");
const getColumns = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const boardId = req.baseUrl.split('/')[2];
    try {
        const foundedColumns = yield columnService.findColumns({ boardId });
        res.json(foundedColumns);
    }
    catch (err) {
        console.log(err);
    }
});
exports.getColumns = getColumns;
const getColumnById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foundedColumn = yield columnService.findColumnById(req.params['columnId']);
        res.json(foundedColumn);
    }
    catch (err) {
        return res.status(404).send((0, error_service_1.createError)(404, 'Column was not founded!'));
    }
});
exports.getColumnById = getColumnById;
const createColumn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const guid = req.header('Guid') || 'undefined';
    const initUser = req.header('initUser') || 'undefined';
    const boardId = req.baseUrl.split('/')[2];
    const bodyError = (0, error_service_1.checkBody)(req.body, ['title', 'order']);
    if (bodyError) {
        return res.status(400).send((0, error_service_1.createError)(400, "bad request: " + bodyError));
    }
    const { title, order } = req.body;
    try {
        const newColumn = yield columnService.createColumn({ title, order, boardId }, guid, initUser);
        res.json(newColumn);
    }
    catch (err) {
        return console.log(err);
    }
});
exports.createColumn = createColumn;
const updateColumn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const guid = req.header('Guid') || 'undefined';
    const initUser = req.header('initUser') || 'undefined';
    const bodyError = (0, error_service_1.checkBody)(req.body, ['title', 'order']);
    if (bodyError) {
        return res.status(400).send((0, error_service_1.createError)(400, "bad request: " + bodyError));
    }
    const { title, order } = req.body;
    try {
        const updatedColumn = yield columnService.updateColumn(req.params['columnId'], { title, order }, guid, initUser);
        res.json(updatedColumn);
    }
    catch (err) {
        return console.log(err);
    }
});
exports.updateColumn = updateColumn;
const deleteColumn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const guid = req.header('Guid') || 'undefined';
    const initUser = req.header('initUser') || 'undefined';
    try {
        const deletedColumn = yield columnService.deleteColumnById(req.params['columnId'], guid, initUser);
        res.json(deletedColumn);
    }
    catch (err) {
        return console.log(err);
    }
});
exports.deleteColumn = deleteColumn;

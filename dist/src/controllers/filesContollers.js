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
exports.deleteFile = exports.uploadFile = exports.findFiles = exports.getFilesByBoard = exports.getFile = void 0;
const error_service_1 = require("../services/error.service");
const fs_1 = __importDefault(require("fs"));
const fileService = __importStar(require("../services/file.service"));
const boardService = __importStar(require("../services/board.service"));
const getFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const path = `files/${req.params.taskId}-${req.params.fileName}`;
    fs_1.default.readFile(path, (err, file) => {
        if (err) {
            return res.status(404).send((0, error_service_1.createError)(404, "file not founded"));
        }
        res.setHeader('Content-Type', 'image/jpeg');
        res.send(file);
    });
});
exports.getFile = getFile;
const getFilesByBoard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const boardId = req.params.boardId;
    try {
        const files = yield fileService.findFiles({ boardId });
        res.json(files);
    }
    catch (error) {
    }
});
exports.getFilesByBoard = getFilesByBoard;
const findFiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const boards = yield boardService.getBordsIdsByUserId(req.query.userId);
    const ids = req.query.ids;
    const taskId = req.query.taskId;
    const allFiles = yield fileService.findFiles({});
    if (ids) {
        return res.json(allFiles.filter(item => ids.includes(item._id)));
    }
    else if (taskId) {
        return res.json(allFiles.filter(oneFile => oneFile.taskId == taskId));
    }
    else if (boards) {
        return res.json(allFiles.filter(oneFile => boards.includes(oneFile.boardId)));
    }
    else {
        return res.status(400).send((0, error_service_1.createError)(400, 'Bad request'));
    }
});
exports.findFiles = findFiles;
const uploadFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.params.error === "file exist") {
        return res.status(402).send((0, error_service_1.createError)(402, "file exist"));
    }
    else if (req.params.error === "file not allowed") {
        return res.status(400).send((0, error_service_1.createError)(400, "only images"));
    }
    else if (req.params.error) {
        return res.status(400).send((0, error_service_1.createError)(400, req.params.error));
    }
    return res.json(yield fileService.getFileById(req.params.fileId));
});
exports.uploadFile = uploadFile;
const deleteFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const guid = req.header('Guid') || 'undefined';
    const initUser = req.header('initUser') || 'undefined';
    try {
        const deletedFile = yield fileService.deleteFileById(req.params.fileId, guid, initUser);
        res.json(deletedFile);
    }
    catch (err) {
        return console.log(err);
    }
});
exports.deleteFile = deleteFile;

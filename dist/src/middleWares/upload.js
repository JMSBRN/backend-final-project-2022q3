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
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const fileService = __importStar(require("../services/file.service"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, next) => {
        fs_1.default.mkdir('files/', (err) => {
            next(null, 'files/');
        });
    },
    filename: (req, fileFromReq, next) => {
        const taskId = req.body.taskId;
        const { originalname } = fileFromReq;
        next(null, `${taskId}-${originalname}`);
    }
});
exports.upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: (req, fileFromReq, next) => __awaiter(void 0, void 0, void 0, function* () {
        if (fileFromReq.mimetype == 'image/png' || fileFromReq.mimetype == 'image/jpeg') {
            const taskId = req.body.taskId;
            const boardId = req.body.boardId;
            const name = fileFromReq.originalname;
            const path = `files/${taskId}-${name}`;
            const existFile = yield fileService.findOneFile({ taskId, name });
            if (existFile) {
                req.params.error = "File already exist";
                next(null, false);
            }
            const guid = req.header('Guid') || 'undefined';
            const initUser = req.header('initUser') || 'undefined';
            const newFile = yield fileService.createFile({ taskId, name, path, boardId }, guid, initUser);
            req.params.fileId = newFile._id;
            next(null, true);
        }
        else {
            req.params.error = "Incorrect file extension";
            next(null, false);
        }
    })
});

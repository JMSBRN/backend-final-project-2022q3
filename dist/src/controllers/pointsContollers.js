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
exports.deletePoint = exports.updateSetOfPoints = exports.updatePoint = exports.createPoint = exports.findPoints = exports.getPoints = void 0;
const pointService = __importStar(require("../services/point.service"));
const error_service_1 = require("../services/error.service");
const server_service_1 = require("../services/server.service");
const boardService = __importStar(require("../services/board.service"));
const getPoints = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const taskId = req.params['taskId'];
    try {
        const foundedPoints = yield pointService.findPoints({ taskId });
        res.json(foundedPoints);
    }
    catch (err) {
        console.log(err);
    }
});
exports.getPoints = getPoints;
const findPoints = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const boards = yield boardService.getBordsIdsByUserId(req.query.userId);
    const ids = req.query.ids;
    if (ids) {
        const allPoints = yield pointService.findPoints({});
        return res.json(allPoints.filter(item => ids.includes(item._id)));
    }
    else if (boards) {
        const allPoints = yield pointService.findPoints({});
        return res.json(allPoints.filter(onePoint => boards.includes(onePoint.boardId)));
    }
    else {
        return res.status(400).send((0, error_service_1.createError)(400, 'Bad request'));
    }
});
exports.findPoints = findPoints;
const createPoint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const guid = req.header('Guid') || 'undefined';
    const initUser = req.header('initUser') || 'undefined';
    const bodyError = (0, error_service_1.checkBody)(req.body, ['title', 'taskId', 'boardId', 'done']);
    if (bodyError) {
        return res.status(400).send((0, error_service_1.createError)(400, "bad request: " + bodyError));
    }
    const { title, taskId, boardId, done } = req.body;
    try {
        const newPoint = yield pointService.createPoint({ title, taskId, boardId, done }, guid, initUser);
        res.json(newPoint);
    }
    catch (err) {
        return console.log(err);
    }
});
exports.createPoint = createPoint;
const updatePoint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const guid = req.header('Guid') || 'undefined';
    const initUser = req.header('initUser') || 'undefined';
    const bodyError = (0, error_service_1.checkBody)(req.body, ['title', 'done']);
    if (bodyError) {
        return res.status(400).send((0, error_service_1.createError)(400, "bad request: " + bodyError));
    }
    const { title, done } = req.body;
    try {
        const updatedPoint = yield pointService.updatePoint(req.params.pointId, { title, done }, guid, initUser);
        res.json(updatedPoint);
    }
    catch (err) {
        return console.log(err);
    }
});
exports.updatePoint = updatePoint;
const updateSetOfPoints = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const guid = req.header('Guid') || 'undefined';
    const initUser = req.header('initUser') || 'undefined';
    const points = req.body;
    if (points.length == 0) {
        return res.status(400).send((0, error_service_1.createError)(400, 'You need at least 1 point'));
    }
    const updatedPoints = [];
    for (const onePoint of points) {
        const pointError = (0, error_service_1.checkBody)(onePoint, ['_id', 'done']);
        if (pointError) {
            return res.status(400).send((0, error_service_1.createError)(400, pointError));
        }
        const { _id, done } = onePoint;
        const foundedPoints = yield pointService.findPointById(_id);
        if (!foundedPoints) {
            return res.status(404).send((0, error_service_1.createError)(404, 'Point was not founded!'));
        }
        try {
            updatedPoints.push(yield pointService.updatePoint(_id, { done }, guid, initUser, false));
        }
        catch (err) {
            return console.log(err);
        }
    }
    server_service_1.socket.emit('points', {
        action: 'update',
        users: yield boardService.getUserIdsByBoardsIds(updatedPoints.map(item => item.boardId)),
        ids: updatedPoints.map(item => item._id),
        guid,
        notify: false,
        initUser,
    });
    return res.json(updatedPoints);
});
exports.updateSetOfPoints = updateSetOfPoints;
const deletePoint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const guid = req.header('Guid') || 'undefined';
    const initUser = req.header('initUser') || 'undefined';
    try {
        const deletedPoint = yield pointService.deletePointById(req.params.pointId, guid, initUser);
        res.json(deletedPoint);
    }
    catch (err) {
        return console.log(err);
    }
});
exports.deletePoint = deletePoint;

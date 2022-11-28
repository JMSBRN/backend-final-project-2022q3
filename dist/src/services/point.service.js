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
exports.deletePointsByParams = exports.deletePointById = exports.updatePoint = exports.findPointById = exports.findPoints = exports.createSetOfPoints = exports.createPoint = void 0;
const point_1 = __importDefault(require("../models/point"));
const mongodb_1 = require("mongodb");
const server_service_1 = require("./server.service");
const boardService = __importStar(require("./board.service"));
const createPoint = (params, guid, initUser, emit = true, notify = true) => __awaiter(void 0, void 0, void 0, function* () {
    const newPoint = new point_1.default(params);
    yield newPoint.save();
    if (emit) {
        server_service_1.socket.emit('points', {
            action: 'add',
            users: yield boardService.getUserIdsByBoardsIds([newPoint.boardId]),
            ids: [newPoint._id],
            guid,
            notify,
            initUser
        });
    }
    return newPoint;
});
exports.createPoint = createPoint;
const createSetOfPoints = (taskId, boardId, newPoints, guid, initUser) => __awaiter(void 0, void 0, void 0, function* () {
    if (newPoints.length === 0) {
        return [];
    }
    const createdPoints = [];
    for (const onePoint of newPoints) {
        createdPoints.push(yield (0, exports.createPoint)(Object.assign(Object.assign({}, onePoint), { taskId, boardId }), guid, initUser, false));
    }
    server_service_1.socket.emit('points', {
        action: 'add',
        users: yield boardService.getUserIdsByBoardsIds(createdPoints.map(item => item.boardId)),
        ids: createdPoints.map(item => item._id),
        guid: 'doesnt metter',
        notify: false,
        initUser,
    });
    return createdPoints;
});
exports.createSetOfPoints = createSetOfPoints;
const findPoints = (params) => {
    return point_1.default.find(params);
};
exports.findPoints = findPoints;
const findPointById = (id) => {
    return point_1.default.findById(new mongodb_1.ObjectId(id));
};
exports.findPointById = findPointById;
const updatePoint = (id, params, guid, initUser, emit = true, notify = true) => __awaiter(void 0, void 0, void 0, function* () {
    const pointId = new mongodb_1.ObjectId(id);
    const updatedPoint = yield point_1.default.findByIdAndUpdate(pointId, params, { new: true });
    if (emit) {
        server_service_1.socket.emit('points', {
            action: 'update',
            users: yield boardService.getUserIdsByBoardsIds([updatedPoint.boardId]),
            ids: [updatedPoint._id],
            guid,
            notify,
            initUser
        });
    }
    return updatedPoint;
});
exports.updatePoint = updatePoint;
const deletePointById = (pointId, guid, initUser, emit = true, notify = true) => __awaiter(void 0, void 0, void 0, function* () {
    const id = new mongodb_1.ObjectId(pointId);
    const deletedPoint = yield point_1.default.findByIdAndDelete(id);
    if (emit) {
        server_service_1.socket.emit('points', {
            action: 'delete',
            users: yield boardService.getUserIdsByBoardsIds([deletedPoint.boardId]),
            ids: [deletedPoint._id],
            guid,
            notify,
            initUser
        });
    }
    return deletedPoint;
});
exports.deletePointById = deletePointById;
const deletePointsByParams = (params, guid, initUser) => __awaiter(void 0, void 0, void 0, function* () {
    const points = yield point_1.default.find(params);
    const deletedPoints = [];
    for (const onPoint of points) {
        deletedPoints.push(yield (0, exports.deletePointById)(onPoint._id, guid, initUser, false));
    }
    server_service_1.socket.emit('points', {
        action: 'delete',
        users: yield boardService.getUserIdsByBoardsIds(deletedPoints.map(item => item.boardId)),
        ids: deletedPoints.map(item => item._id),
        guid: 'doesnt metter',
        notify: false,
        initUser,
    });
});
exports.deletePointsByParams = deletePointsByParams;

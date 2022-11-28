"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const taskScheme = new Schema({
    title: {
        type: String,
        required: true,
    },
    order: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    boardId: {
        type: String,
        required: true,
    },
    columnId: {
        type: String,
        required: true,
    },
    users: {
        type: [String],
        default: [],
    }
}, { versionKey: false });
exports.default = mongoose_1.default.model('Task', taskScheme);

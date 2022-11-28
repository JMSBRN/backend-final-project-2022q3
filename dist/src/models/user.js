"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const userScheme = new Schema({
    name: {
        type: String,
        required: true,
    }, login: {
        type: String,
        required: true,
    }, password: {
        type: String,
        required: true,
    }
}, { versionKey: false });
exports.default = mongoose_1.default.model('User', userScheme);

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkToken = exports.signToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../constants");
const signToken = (id, login) => {
    return jsonwebtoken_1.default.sign({ id, login }, constants_1.SECRET_KEY, { expiresIn: '720m' });
};
exports.signToken = signToken;
const checkToken = (token) => {
    try {
        jsonwebtoken_1.default.verify(token, constants_1.SECRET_KEY);
        return true;
    }
    catch (error) {
        return false;
    }
};
exports.checkToken = checkToken;

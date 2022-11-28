"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_mung_1 = __importDefault(require("express-mung"));
function redact(body) {
    if (!body) {
        return body;
    }
    if (Array.isArray(body)) {
        return body.map(item => redact(item));
    }
    if (body._doc) {
        const newBody = Object.assign({}, body._doc);
        if (newBody.password) {
            delete newBody.password;
        }
        return newBody;
    }
    return body;
}
exports.default = express_mung_1.default.json(redact);

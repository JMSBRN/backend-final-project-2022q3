"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socket = exports.server = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const isAuth_1 = __importDefault(require("../middleWares/isAuth"));
const mung_1 = __importDefault(require("../middleWares/mung"));
const authRouter_1 = __importDefault(require("../routes/authRouter"));
const boardsRouter_1 = __importDefault(require("../routes/boardsRouter"));
const filesRouter_1 = __importDefault(require("../routes/filesRouter"));
const tasksSetRouter_1 = __importDefault(require("../routes/tasksSetRouter"));
const usersRouter_1 = __importDefault(require("../routes/usersRouter"));
const boardsSetRouter_1 = __importDefault(require("../routes/boardsSetRouter"));
const columnsSetRouter_1 = __importDefault(require("../routes/columnsSetRouter"));
const pointsRouter_1 = __importDefault(require("../routes/pointsRouter"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("../../swagger.json"));
exports.app = (0, express_1.default)();
exports.server = http_1.default.createServer(exports.app);
exports.socket = new socket_io_1.Server(exports.server, {
    cors: {
        origin: '*'
    }
});
exports.app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
exports.app.use((0, cors_1.default)({ origin: '*' }));
exports.app.use(mung_1.default);
exports.app.use(isAuth_1.default);
exports.app.use('/users', usersRouter_1.default);
exports.app.use('/auth', authRouter_1.default);
exports.app.use('/boards', boardsRouter_1.default);
exports.app.use('/boardsSet', boardsSetRouter_1.default);
exports.app.use('/columnsSet', columnsSetRouter_1.default);
exports.app.use('/tasksSet', tasksSetRouter_1.default);
exports.app.use('/file', filesRouter_1.default);
exports.app.use('/points', pointsRouter_1.default);
exports.app.use('/files', express_1.default.static('files'));

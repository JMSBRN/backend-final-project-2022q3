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
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getUsers = void 0;
const userService = __importStar(require("../services/user.service"));
const error_service_1 = require("../services/error.service");
const hash_service_1 = require("../services/hash.service");
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ids = req.query.ids;
    const foundedUsers = yield userService.findUsers();
    if (ids) {
        return res.json(foundedUsers.filter(item => ids.includes(item._id)));
    }
    try {
        res.json(foundedUsers);
    }
    catch (err) {
        console.log(err);
    }
});
exports.getUsers = getUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foundedUser = yield userService.findUserById(req.params['id']);
        res.json(foundedUser);
    }
    catch (err) {
        return res.status(404).send((0, error_service_1.createError)(404, 'User was not founded!'));
    }
});
exports.getUserById = getUserById;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params['id'];
    const bodyError = (0, error_service_1.checkBody)(req.body, ['name', 'login', 'password']);
    if (bodyError) {
        return res.status(400).send((0, error_service_1.createError)(400, "bad request: " + bodyError));
    }
    const { login, name, password } = req.body;
    const foundedUser = yield userService.findOneUser({ login });
    if (foundedUser && foundedUser.id !== id) {
        return res.status(409).send((0, error_service_1.createError)(409, 'Login already exist'));
    }
    try {
        const hashedPassword = yield (0, hash_service_1.hashPassword)(password);
        const updatedUser = yield userService.updateUser(id, { login, name: name, password: hashedPassword });
        res.json(updatedUser);
    }
    catch (err) {
        return console.log(err);
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const guid = req.header('Guid') || 'undefined';
    const initUser = req.header('initUser') || 'undefined';
    try {
        const deletedUser = yield userService.deleteUserById(req.params.id, guid, initUser);
        res.json(deletedUser);
    }
    catch (err) {
        return console.log(err);
    }
});
exports.deleteUser = deleteUser;

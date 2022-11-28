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
exports.chek = exports.signUp = exports.signIn = void 0;
const userService = __importStar(require("../services/user.service"));
const error_service_1 = require("../services/error.service");
const hash_service_1 = require("../services/hash.service");
const token_service_1 = require("../services/token.service");
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bodyError = (0, error_service_1.checkBody)(req.body, ['login', 'password']);
    if (bodyError) {
        return res.status(400).send((0, error_service_1.createError)(400, "bad request: " + bodyError));
    }
    const { login, password } = req.body;
    const foundedUser = yield userService.findOneUser({ login });
    if (foundedUser) {
        const isCorrectPassword = yield (0, hash_service_1.checkPassword)(password, foundedUser.password);
        if (isCorrectPassword) {
            return res.send({ token: (0, token_service_1.signToken)(foundedUser._id, login) });
        }
    }
    return res.status(401).send((0, error_service_1.createError)(401, 'Authorization error'));
});
exports.signIn = signIn;
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bodyError = (0, error_service_1.checkBody)(req.body, ['name', 'login', 'password']);
    if (bodyError) {
        return res.status(400).send((0, error_service_1.createError)(400, "bad request: " + bodyError));
    }
    const { login, name, password } = req.body;
    const foundedUser = yield userService.findOneUser({ login });
    if (foundedUser) {
        return res.status(409).send((0, error_service_1.createError)(409, 'Login already exist'));
    }
    const hashedPassword = yield (0, hash_service_1.hashPassword)(password);
    try {
        const newUser = yield userService.createUser({ login, name, password: hashedPassword });
        res.json(newUser);
    }
    catch (err) {
        return console.log(err);
    }
});
exports.signUp = signUp;
const chek = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(200).send((0, error_service_1.createError)(200, 'success'));
});
exports.chek = chek;

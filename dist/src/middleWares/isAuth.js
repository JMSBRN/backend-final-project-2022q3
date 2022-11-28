"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_service_1 = require("../services/error.service");
const token_service_1 = require("../services/token.service");
const isAuth = (req, res, next) => {
    if (['/auth/signin', '/auth/signup'].includes(req.path) || req.path.substring(0, 7) == '/files/') {
        return next();
    }
    const authHeader = req.header('Authorization');
    if (authHeader) {
        const [type, token] = authHeader.split(' ');
        if (type === 'Bearer' && (0, token_service_1.checkToken)(token)) {
            return next();
        }
    }
    return res.status(403).send((0, error_service_1.createError)(403, 'Invalid token'));
};
exports.default = isAuth;

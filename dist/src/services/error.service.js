"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkBody = exports.createError = void 0;
function createError(statusCode, message) {
    return { statusCode, message };
}
exports.createError = createError;
function checkBody(body, keys) {
    const bodyKeys = Object.keys(body);
    if (bodyKeys.length === 0) {
        return 'body is required';
    }
    for (const key of keys) {
        if (!body.hasOwnProperty(key)) {
            return `${key} is required`;
        }
    }
    if (bodyKeys.length > keys.length) {
        const extraProps = bodyKeys.filter(prop => !keys.includes(prop));
        return `properties [ ${extraProps.join(',')} ] shouldn't exist`;
    }
    return null;
}
exports.checkBody = checkBody;

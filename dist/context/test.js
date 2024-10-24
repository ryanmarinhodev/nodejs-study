"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStorage = exports.UserContext = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
exports.UserContext = (0, react_1.createContext)({});
const UserStorage = ({ children }) => {
    const [login, setLogin] = (0, react_1.useState)(false);
    const [user, setUser] = (0, react_1.useState)({});
    return ((0, jsx_runtime_1.jsx)(exports.UserContext.Provider, { value: { login, user }, children: children }));
};
exports.UserStorage = UserStorage;

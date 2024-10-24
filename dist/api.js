"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const token = localStorage.getItem('token');
const api = axios_1.default.create({
    baseURL: 'https://localhost:4000', //Trocar esse endPoint para o novo quando hospedar essa api node
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        Authorization: token,
    },
});
exports.default = api;

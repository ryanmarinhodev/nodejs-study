"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_2 = __importDefault(require("express"));
const VideosRepository_1 = __importDefault(require("../models/videos/repositories/VideosRepository"));
const login_1 = require("../models/middleware/login");
const videosRoutes = (0, express_1.Router)();
const videoRepository = new VideosRepository_1.default();
videosRoutes.use(express_2.default.json());
videosRoutes.post('/create-video', login_1.login, (request, response) => {
    videoRepository.create(request, response);
});
videosRoutes.get('/get-videos', (request, response) => {
    videoRepository.getVideos(request, response);
});
videosRoutes.get('/search', (request, response) => {
    videoRepository.searchVideos(request, response);
});
exports.default = videosRoutes;

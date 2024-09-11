import { Router } from 'express';
import express from 'express'
import VideoRepository from '../models/videos/repositories/VideosRepository';
import {login} from '../models/middleware/login';


const videosRoutes = Router();
const videoRepository = new VideoRepository()

videosRoutes.use(express.json());


videosRoutes.post('/create-video',  login, (request, response) => {
    videoRepository.create(request, response)
});

videosRoutes.get('/get-videos', (request, response) => {
    videoRepository.getVideos(request, response);
});

videosRoutes.get('/search', (request, response) => {
    videoRepository.searchVideos(request, response);
  });



export default videosRoutes;
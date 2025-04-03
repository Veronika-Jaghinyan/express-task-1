import express from 'express';
import upload from '../middleware/upload.js';
import {
  getAllVideos,
  getVideoById,
  streamVideo,
  addNewVideo,
  updateVideo,
  deleteVideo,
} from '../handlers/video-handler.js';

const router = express.Router();

router.get('/', getAllVideos);
router.get('/:id', getVideoById);
router.get('/video/:id', streamVideo);
router.post('/', upload.fields([{ name: 'video' }, { name: 'thumbnail' }]), addNewVideo);
router.put('/:id', upload.fields([{ name: 'video' }, { name: 'thumbnail' }]), updateVideo);
router.delete('/:id', deleteVideo);

export default router;

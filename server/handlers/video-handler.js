import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { getVideoDurationInSeconds } from 'get-video-duration';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let videos = [];

export const getAllVideos = (req, res) => {
  res.status(200).render('index', { videos });
};

export const getVideoById = (req, res) => {
  const videoId = parseInt(req.params.id);
  const video = videos.find(v => v.id === videoId);

  if (video) {
    res.render('video-page', { video });
  } else {
    res.status(404).render('not-found', { msg: 'Video not found' });
  }
};

export const streamVideo = async (req, res) => {
  const videoId = parseInt(req.params.id);
  const video = videos.find(v => v.id === videoId);

  if (video) {
    const videoPath = path.join(__dirname, '..', '..', 'public', 'uploads', 'videos', video.src);

    const videoSize = video.size;
    let videoDuration = await getVideoDurationInSeconds(videoPath);

    const bytesPerSec = videoSize / videoDuration;
    const sizeForTenSec = Math.round(bytesPerSec * 10);

    const range = req.headers.range;

    if (!range) {
      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Content-Length', videoSize);
      const stream = fs.createReadStream(videoPath);
      stream.pipe(res);
    } else {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0]);
      const end = Math.min(start + sizeForTenSec - 1, videoSize - 1);
      const contentLength = end - start + 1;
      const stream = fs.createReadStream(videoPath, { start, end });

      res.status(206); // Partial Content
      res.setHeader('Content-Range', `bytes ${start}-${end}/${videoSize}`);
      res.setHeader('Content-Length', contentLength);
      res.setHeader('Content-Type', 'video/mp4');
      stream.pipe(res);
    }
  } else {
    res.status(404).send('Video not found');
  }
};

export const addNewVideo = (req, res) => {
  const { title } = req.body;
  const src = req.files['video'] ? req.files['video'][0].filename : null;
  const thumbnail = req.files['thumbnail'] ? req.files['thumbnail'][0].filename : null;
  const size = req.files['video'] ? req.files['video'][0].size : null;
  const id = videos.length + 1;

  const newVideo = {
    id,
    src,
    title: title.trim() || `Video - ${id}`,
    createdAt: new Date().toISOString(),
    size,
    path: `video-${id}`,
    thumbnail,
    updatedAt: null,
  };
  videos.push(newVideo);

  res.status(201).json({ msg: 'Video has been successfully created' });
};

export const updateVideo = (req, res) => {
  const videoId = parseInt(req.params.id);
  const video = videos.find(v => v.id === videoId);

  const { title } = req.body;
  const src = req.files['video'] ? req.files['video'][0].filename : null;
  const thumbnail = req.files['thumbnail'] ? req.files['thumbnail'][0].filename : null;
  const size = req.files['video'] ? req.files['video'][0].size : null;

  if (video) {
    videos = videos.map(v => {
      if (v.id === videoId) {
        return {
          ...video,
          title: title.trim() || video.title,
          src: src || video.src,
          thumbnail: thumbnail || video.thumbnail,
          size: size || video.size,
          updatedAt: new Date().toISOString(),
        };
      } else {
        return v;
      }
    });

    res.status(201).json({ msg: 'Video has been successfully updated' });
  } else {
    res.status(404).json({ msg: 'Video not found' });
  }
};

export const deleteVideo = (req, res) => {
  const videoId = parseInt(req.params.id);
  const video = videos.find(v => v.id === videoId);

  if (video) {
    videos = videos.filter(v => v.id !== videoId);

    const videoPath = path.join(__dirname, '..', '..', 'public', 'uploads', 'videos', video.src);
    const thumbnailPath = path.join(__dirname, '..', '..', 'public', 'uploads', 'thumbnails', video.thumbnail);

    fs.unlink(videoPath, error => {
      if (error) console.error('Error deleting file:', error);
    });

    fs.unlink(thumbnailPath, error => {
      if (error) console.error('Error deleting file:', error);
    });

    res.status(201).json({ msg: 'Video has been successfully deleted' });
  } else {
    res.status(404).json({ msg: 'Video not found' });
  }
};

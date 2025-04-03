import fs from 'fs';

const prepareUploadFolders = (req, res, next) => {
  const videoDir = 'public/uploads/videos';
  const thumbnailDir = 'public/uploads/thumbnails';

  // Create video directory if it doesn't exist
  if (!fs.existsSync(videoDir)) {
    fs.mkdirSync(videoDir, { recursive: true });
  }

  // Create thumbnail directory if it doesn't exist
  if (!fs.existsSync(thumbnailDir)) {
    fs.mkdirSync(thumbnailDir, { recursive: true });
  }

  next();
};

export default prepareUploadFolders;

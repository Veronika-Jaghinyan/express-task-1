import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const clearFolder = folderPath => {
  fs.readdir(folderPath, (error, files) => {
    if (error) {
      console.error('Error reading folder:', error);
      return;
    }

    files.forEach(file => {
      const filePath = path.join(folderPath, file);
      fs.unlink(filePath, error => {
        if (error) {
          console.error('Error deleting file:', filePath);
        } else {
          console.log(`Deleted file: ${filePath}`);
        }
      });
    });
  });
};

const clearUploadFolders = () => {
  // Directories to clear
  const videosFolderPath = path.join(__dirname, '..', '..', 'public/uploads/videos');
  const thumbnailsFolderPath = path.join(__dirname, '..', '..', 'public/uploads/thumbnails');

  clearFolder(videosFolderPath);
  clearFolder(thumbnailsFolderPath);
};

export default clearUploadFolders;

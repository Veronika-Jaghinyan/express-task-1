import fs from 'fs';

const deleteFile = filePath => {
  fs.unlink(filePath, error => {
    if (error) console.error('Error deleting file:', error);
  });
};

export default deleteFile;

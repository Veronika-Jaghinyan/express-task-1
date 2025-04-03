import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'video') {
      cb(null, 'public/uploads/videos');
    } else if (file.fieldname === 'thumbnail') {
      cb(null, 'public/uploads/thumbnails');
    } else {
      cb(new Error('Invalid file type'), null);
    }
  },
  filename: function (req, file, cb) {
    const prefix = file.fieldname === 'video' ? 'video' : 'thumbnail';
    const ind = req.method === 'PUT' ? req.params.id : Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `${prefix}-${ind}${ext}`);
  },
});

const upload = multer({ storage });

export default upload;

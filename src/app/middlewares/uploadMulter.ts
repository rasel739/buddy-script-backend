import multer from 'multer';
import { Request } from 'express';

import httpStatus from 'http-status';
import ApiError from '../../errors/ApiError';
import { MAX_FILE_SIZE } from '../../constrants';

const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new ApiError(httpStatus.BAD_REQUEST, 'Only image files are allowed'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
});

export const uploadSingle = upload.single('image');

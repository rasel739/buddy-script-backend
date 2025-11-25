import httpStatus from 'http-status';
import { ALLOWED_FORMATS, MAX_FILE_SIZE, MAX_HEIGHT, MAX_WIDTH } from '../constrants';
import ApiError from '../errors/ApiError';
import sharp from 'sharp';
import { IImageUploadResult } from '../interface/common';
import cloudinary from '../config/cloudinary';

export const validateImage = async (file: Express.Multer.File) => {
  if (file.size > MAX_FILE_SIZE) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Image size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`
    );
  }
  const fileExtension = file.originalname.split('.').pop()?.toLowerCase();

  if (!fileExtension || !ALLOWED_FORMATS.includes(fileExtension)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Invalid file format. Allowed formats: ${ALLOWED_FORMATS.join(', ')}`
    );
  }

  if (!file.mimetype.startsWith('image/')) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'File must be an image');
  }
};

const optimizeImage = async (buffer: Buffer): Promise<Buffer> => {
  try {
    const image = sharp(buffer);
    const metadata = await image.metadata();

    let width = metadata.width;
    let height = metadata.height;

    if (width && height) {
      if (width > MAX_WIDTH || height > MAX_HEIGHT) {
        const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
    }

    return await image
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: 85, progressive: true })
      .toBuffer();
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to process image');
  }
};

export const uploadToCloudinary = async (
  buffer: Buffer,
  folder: string = 'posts'
): Promise<IImageUploadResult> => {
  try {
    const optimizedBuffer = await optimizeImage(buffer);

    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `post-feed/${folder}`,
          resource_type: 'image',
          transformation: [{ quality: 'auto:good' }, { fetch_format: 'auto' }],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(optimizedBuffer);
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      size: result.bytes,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload image');
  }
};

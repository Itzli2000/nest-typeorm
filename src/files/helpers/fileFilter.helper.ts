export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file) {
    return callback(new Error('File is required'), false);
  }

  const fileExtension = file.mimetype.split('/')[1];
  const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'pdf'];
  if (!validExtensions.includes(fileExtension)) {
    return callback(new Error('Invalid file extension'), false);
  }

  callback(null, true);
};

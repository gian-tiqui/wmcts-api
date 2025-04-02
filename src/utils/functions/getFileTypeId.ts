const getFileTypeId = (file: Express.Multer.File) => {
  return file.mimetype === 'application/pdf' ? 1 : 2;
};

export default getFileTypeId;

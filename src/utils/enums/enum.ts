enum Messages {
  INTERNAL_SERVER = 'There was a problem in the server.',
  IMAGES_ERROR = 'Only image files are allowed.',
}

enum LogMethod {
  CREATE = 1,
  UPDATE = 2,
  SOFT_DELETE = 3,
  DELETE = 4,
  RETRIEVE = 5,
}

enum LogType {
  USER = 1,
}

enum PaginationDefault {
  OFFSET = 0,
  LIMIT = 10,
}

enum Directory {
  UPLOAD = 'uploads',
  COMMENT_IMAGES = 'comment',
  SERVICE_REPORT = 'service_reports',
}

export { Messages, LogMethod, LogType, PaginationDefault, Directory };

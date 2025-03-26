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

enum TicketStatus {
  NEW = 1,
  ACKNOWLEDGED = 2,
  ASSIGNED = 3,
  ESCALATED = 4,
  RESOLVED = 5,
  CLOSED = 6,
  CLOSED_RESOLVED = 7,
  CANCELLED = 8,
  ON_HOLD = 9,
}

enum StatusIcons {
  NEW = 'pi pi-plus',
  ACKNOWLEDGED = 'pi pi-check',
  ASSIGNED = 'pi pi-user-plus',
  ESCALATED = 'pi pi-user-edit',
  RESOLVED = 'pi pi-verified',
  CLOSED = 'pi pi-lock',
  CLOSED_RESOLVED = 'pi pi-list-check',
  CANCELLED = 'pi pi-cancel',
  ON_HOLD = 'pi pi-pause-circle',
}

enum PriorityLevel {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
}

export {
  PriorityLevel,
  StatusIcons,
  Messages,
  LogMethod,
  LogType,
  PaginationDefault,
  Directory,
  TicketStatus,
};

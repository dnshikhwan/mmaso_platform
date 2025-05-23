export const logLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    severity: 5,
    silly: 6,
  },
  colors: {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "green",
    verbose: "blue",
    severity: "purple",
    silly: "purple",
  },
};

export const HTTP_RESPONSE_CODE = {
  NOT_FOUND: 404,
  CREATED: 201,
  CONFLICT: 409,
  TOO_MANY_REQUEST: 429,
  BAD_REQUEST: 400,
  OK: 200,
  UNAUTHORIZED: 401,
  SERVER_ERROR: 500,
  FORBIDDEN: 403,
};

export const enum HttpStatusCode {
  NOT_FOUND = 404,
  CREATED = 201,
  CONFLICT = 409,
  TOO_MANY_REQUEST = 429,
  BAD_REQUEST = 400,
  SUCCESS = 200,
  UNAUTHORIZED = 401,
  SERVER_ERROR = 500,
  FORBIDDEN = 403,
}

export const APP_MESSAGE = {
  serverError: "An unexpected error occured. Please try again later.",
  missingRequiredFields: "Missing required fields.",
  success: "Success",

  // token
  accessTokenExpired: "Access token expired.",
  adminSignedIn: "Admin successfully signed in.",

  // admin
  adminCreated: "Admin created succesfully.",

  // event
  eventCreated: "Event created successfully.",
  eventNotFound: "Event not found.",
  eventDeleted: "Event deleted successfully",
  eventUpdated: "Event updated successfully",
  studentAlreadyJoined: "Student already joined the event.",
  eventAlreadyMaxed: "Event participants reached limit",
  studentJoined: "Student participated successfully.",

  //student
  studentDuplicatedEmail: "Student with this email already exists.",
  studentCreated: "Student created successfully.",
  studentNotFound: "Student not found.",
  studentDeleted: "Student successfully deleted.",
  studentUpdated: "Student successfully updated.",

  // auth
  policyError: "Please agree to our privacy policy.",
  emailExists: "User with this email address already exists.",
  signedUp: "User successfully signed up.",
  signedIn: "User successfully signed in.",
  invalidCredentials: "Invalid email or password.",
  userUnauthorized:
    "User unauthorized! Please sign in to access this resource.",
  signedOut: "User successfully signed out.",
  passwordChanged: "Password successfully changed.",

  // Notes
  noteCreated: "Note successfully created.",
  noteUpdated: "Note successfully updated.",
  noteDeleted: "Note successfully deleted.",
  noteNotFound: "Note not found.",
  noteFetchError: "Failed to retrieve notes.",
  noteAlreadyExists: "A note with this title already exists.",

  //   announcement
  announcementCreated: "Announcement successfully created.",
};

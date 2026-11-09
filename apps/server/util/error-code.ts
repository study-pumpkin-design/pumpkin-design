export const ERROR_CODES = {
  admin: {
    UNPERMITTED_ACTION_NOT_AN_ADMIN:
      "you dont have permission to perform this action. Request an admin to do it",
    DUPLICATE_ADMIN_CREATION: "admin already exists",
  },
  user: {
    DUPLICATE_USER_CREATION: "user already exists",
  },
  mail: {
    CLASS_INITIALIZATION_ERROR: "error in class instantiation",
  },
  INCORRECT_INPUT_DATA: "invalid input",
  JWT_VERIFICATION_FAILIURE: "failed to verify authentication",
  NO_VALID_TOKEN_FOUND: "missing authentication token",
  INVALID_STATE_INTENT: "malicious activity detected",
};

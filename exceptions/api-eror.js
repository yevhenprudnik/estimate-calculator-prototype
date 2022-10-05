module.exports = class ApiError extends Error {
  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
  
  static BadRequest(message, errors = []) {
    return new ApiError(400, message, errors);
  }

  static Forbidden(message, errors = []) {
    return new ApiError(403, message, errors);
  }
  
  static NotFound(message, errors = []) {
    return new ApiError(404, message, errors);
  }
  
  static Conflict(message, errors = []) {
    return new ApiError(409, message, errors);
  }
}
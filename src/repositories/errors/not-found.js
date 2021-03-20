module.exports = class NotFoundError extends Error {
  constructor(message, baseError) {
    super(message);
    this.baseError = baseError;
  }
};

/**
 * @class StorageError
 * @extends Error
 * Custom error class for storage-related errors
 */
export class StorageError extends Error {
  constructor(message, type) {
    super(message);
    this.name = 'StorageError';
    this.type = type;
  }
}

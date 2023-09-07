class MissingFieldsException extends Error {
  constructor(fields) {
    const message = `The following fields are required: ${fields.join(', ')}`;
    super(message);
  }
}

export { MissingFieldsException };

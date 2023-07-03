class UnknownTemplateException extends Error {
  constructor(id) {
    const message = `No template was found for id ${id}.`;
    super(message);
  }
}

export { UnknownTemplateException };

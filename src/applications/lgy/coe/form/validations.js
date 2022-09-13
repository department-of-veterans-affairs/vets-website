export const validateDocumentDescription = (errors, fileList) => {
  fileList.forEach((file, index) => {
    const error =
      file.attachmentType === 'Other' && !file.attachmentDescription
        ? 'Please provide a description'
        : null;
    if (error && !errors[index]) {
      /* eslint-disable no-param-reassign */
      errors[index] = {
        attachmentDescription: {
          __errors: [],
          addError(msg) {
            this.__errors.push(msg);
          },
        },
      };
      /* eslint-enable no-param-reassign */
    }
    if (error) {
      errors[index].attachmentDescription.addError(error);
    }
  });
};

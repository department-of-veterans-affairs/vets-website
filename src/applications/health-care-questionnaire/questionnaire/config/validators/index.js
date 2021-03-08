const maxLength = (max, errors, fieldData) => {
  if (fieldData.length > max) {
    const lettersToRemove = (fieldData.length - max).toLocaleString();
    errors.addError(
      `You only have ${max.toLocaleString()} letters, you have to remove ${lettersToRemove} letters`,
    );
  }
};

const preventLargeFields = (
  errors,
  fieldData,
  _formData,
  _fieldSchema,
  _errorMessages,
  _options,
) => maxLength(500_000, errors, fieldData);

export { preventLargeFields, maxLength };

// function() {

// },

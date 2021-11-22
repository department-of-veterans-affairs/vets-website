const maxLength = (max, errors, fieldData) => {
  if (errors && fieldData && fieldData.length > max) {
    const lettersToRemove = (fieldData.length - max).toLocaleString();
    errors.addError(
      `This field should be less than ${max.toLocaleString()} characters. Please remove ${lettersToRemove} characters`,
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

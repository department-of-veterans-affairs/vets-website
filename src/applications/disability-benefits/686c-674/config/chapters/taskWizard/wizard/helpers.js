export const validateAtLeastOneSelected = (errors, fieldData) => {
  if (!Object.values(fieldData).some(val => val === true)) {
    errors.addError('Please select at least one option');
  }
};

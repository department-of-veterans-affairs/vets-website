export function isInPast(errors, fieldData) {
  const fieldDate = new Date(fieldData);
  if (fieldDate.getTime() > Date.now()) {
    errors.addError('Service end date must be in the past');
  }
}

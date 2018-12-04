import get from 'platform/utilities/data/get';

export function requireOneSelected(
  errors,
  fieldData,
  formData,
  schema,
  errorMessages,
  options,
) {
  // TODO: If fieldData isn't an array, then what?
  const foundOne = fieldData.some(
    data => !!get(options.selectedPropName, data),
  );

  if (!foundOne) {
    errors.addError(
      'Please select at least one condition (or all that apply).',
    );
  }
}

export function isInPast(errors, fieldData) {
  const fieldDate = new Date(fieldData);
  if (fieldDate.getTime() > Date.now()) {
    errors.addError('Service end date must be in the past');
  }
}

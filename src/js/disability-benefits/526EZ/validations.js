import get from '../../common/utils/data-utils/get';

export function requireOneSelected(errors, fieldData, formData, schema, errorMessages, options) {
  // If fieldData isn't an array, then what?
  const foundOne = fieldData.some(data => !!get(options.selectedPropName, data));

  if (!foundOne) {
    errors.addError('Please select one');
  }
}

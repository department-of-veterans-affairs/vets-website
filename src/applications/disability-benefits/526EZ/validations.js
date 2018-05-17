import get from '../../../platform/utilities/data/get';

export function requireOneSelected(errors, fieldData, formData, schema, errorMessages, options) {
  // TODO: If fieldData isn't an array, then what?
  const foundOne = fieldData.some(data => !!get(options.selectedPropName, data));

  if (!foundOne) {
    errors.addError('Please select at least one condition (or all that apply).');
  }
}


// Make sure all the validations on label get displayed on the parent object
// Note: This is possibly deceptive since it doesn't _actually_ run all the validations on the label, just a
//  few we call out deliberately.
export function validateTreatmentCenterName(errors, fieldData, formData, schema) {
  const { maxLength, pattern } = schema.properties.label;
  const input = fieldData.label || '';

  if (maxLength && input.length > maxLength) {
    errors.addError(`Please enter a name with fewer than ${maxLength} characters.`);
  }

  if (pattern && !(new RegExp(pattern)).test(input)) {
    // TODO: Figure out how to communicate this more effectively
    errors.addError('Please enter a valid name.');
  }
}

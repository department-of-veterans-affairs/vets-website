import { fullNameReducer } from '~/platform/forms/components/review/PreSubmitSection';

export function fullNameToString(fullName) {
  return `${fullName.first || ''}${
    fullName.middle ? ` ${fullName.middle}` : ''
  } ${fullName.last || ''}`;
}

export function validateNameMatchesUser(errors, fieldData, formData) {
  const expectedName = fullNameToString(formData.applicantName);
  if (fullNameReducer(expectedName) !== fullNameReducer(fieldData)) {
    errors.addError(
      `Enter your name exactly as it appears on your form: ${expectedName}`,
    );
  }
}

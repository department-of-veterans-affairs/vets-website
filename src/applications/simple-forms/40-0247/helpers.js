export function textInputNumericRange(errors, formData, input) {
  const { schemaKey, range, customErrorMessages } = input;
  const nbrCopies = parseInt(formData[schemaKey], 10);
  if (nbrCopies < range.min) {
    errors[schemaKey].addError(
      customErrorMessages?.min ||
        `Please raise your number to at least ${range.min}`,
    );
  } else if (nbrCopies > range.max) {
    errors[schemaKey].addError(
      customErrorMessages?.max ||
        `Please lower your number to less than ${range.max}`,
    );
  }
}

export function getInitialData({ mockData, environment }) {
  return !!mockData && environment.isLocalhost() && !window.Cypress
    ? mockData
    : undefined;
}

export function textInputNumericRange(errors, field, range) {
  const nbrCopies = parseInt(field, 10);
  if (nbrCopies < range.min || nbrCopies > range.max) {
    errors.addError(
      `Please enter a number between ${range.min} and ${range.max}`,
    );
  }
}

export function getInitialData({ mockData, environment }) {
  return !!mockData && environment.isLocalhost() && !window.Cypress
    ? mockData
    : undefined;
}

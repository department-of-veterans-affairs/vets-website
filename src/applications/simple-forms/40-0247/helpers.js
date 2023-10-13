import moment from 'moment';

export function getInitialData({ mockData, environment }) {
  return !!mockData && environment.isLocalhost() && !window.Cypress
    ? mockData
    : undefined;
}

export function dateOfDeathValidation(errors, fields) {
  const { veteranDateOfBirth, veteranDateOfDeath } = fields;
  const dob = moment(veteranDateOfBirth);
  const dod = moment(veteranDateOfDeath);

  if (dod.isBefore(dob)) {
    errors.veteranDateOfDeath.addError(
      'Provide a date that is after the date of birth',
    );
  }
}

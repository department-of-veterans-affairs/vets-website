import moment from 'moment';

export function validateSponsorDeathDate(errors, { isDeceased, dateOfBirth, dateOfDeath }) {
  if (dateOfBirth && dateOfDeath && isDeceased === 'yes' && moment(dateOfDeath).isBefore(moment(dateOfBirth))) {
    errors.dateOfDeath.addError('Date of death must be after date of birth');
  }
}

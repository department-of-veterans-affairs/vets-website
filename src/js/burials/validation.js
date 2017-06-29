import moment from 'moment';

export function validateBurialDate(errors, page) {
  const { burialDate, deathDate } = page;
  if (burialDate && deathDate && moment(burialDate).isBefore(moment(deathDate))) {
    errors.burialDate.addError('Date of burial must be on or after date of death');
  }
}

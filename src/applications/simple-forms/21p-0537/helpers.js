import moment from 'moment';

const AGE_MIN = 0;
const AGE_MAX = 130;

/**
 * Page-level validator for marriageInfo page.
 * Ensures dateOfMarriage is on or after spouseDateOfBirth and
 * ageAtMarriage is between 0 and 130.
 */
export function marriageDateValidation(errors, fields) {
  const { dateOfMarriage, spouseDateOfBirth, ageAtMarriage } =
    fields.remarriage || {};

  if (dateOfMarriage && spouseDateOfBirth) {
    const marriage = moment(dateOfMarriage);
    const dob = moment(spouseDateOfBirth);

    if (marriage.isValid() && dob.isValid() && marriage.isBefore(dob)) {
      errors.remarriage.dateOfMarriage.addError(
        'Date of remarriage must be on or after your spouse\u2019s date of birth',
      );
    }
  }

  if (ageAtMarriage !== undefined && ageAtMarriage !== '') {
    const age = Number(ageAtMarriage);
    if (!Number.isNaN(age) && (age < AGE_MIN || age > AGE_MAX)) {
      errors.remarriage.ageAtMarriage.addError(
        `Enter a number between ${AGE_MIN} and ${AGE_MAX}`,
      );
    }
  }
}

/**
 * Page-level validator for terminationDetails page.
 * Ensures terminationDate is after dateOfMarriage.
 */
export function terminationDateValidation(errors, fields, formData) {
  const terminationDate = fields.remarriage?.terminationDate;
  const dateOfMarriage = formData.remarriage?.dateOfMarriage;

  if (!terminationDate || !dateOfMarriage) return;

  const termination = moment(terminationDate);
  const marriage = moment(dateOfMarriage);

  if (!termination.isValid() || !marriage.isValid()) return;

  if (termination.isSameOrBefore(marriage)) {
    errors.remarriage.terminationDate.addError(
      'Date remarriage ended must be after the date of remarriage',
    );
  }
}

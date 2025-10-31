import {
  parse,
  isValid,
  differenceInYears,
  differenceInMonths,
  differenceInDays,
  format,
} from 'date-fns';

/**
 *
 * @param {String} date - date string that matches the `startFormat`
 * @param {String} startFormat - input date string format using Date-fn patterns
 * @param {String} endFormat - output date string format using Date-fn patterns
 * @returns {String} - formatted date string, or 'Unknown date' if invalid
 */
export const getFormatedDate = (
  date,
  startFormat = 'yyyy-MM-dd',
  endFormat = 'MMMM d, yyyy',
) => {
  const dobObj = parse(date, startFormat, new Date());
  return isValid(dobObj) ? format(dobObj, endFormat) : date || 'Unknown date';
};

/**
 * @typedef {Object} CalculateAgeReturn
 * @property {Number} age - age in years (0 if less than 1 year old or invalid)
 * @property {String} dobStr - formatted date of birth
 * @property {String} labeledAge - age with label ("2 years old", "5 months old",
 *  "Newborn", "Date in the future", or "" if invalid)
 */
/**
 * Calculate age from date of birth and return formatted age and dob string
 * @param {String} dob - any date format that matches `dateInFormat`
 * @param {Object} options
 * @param {String} options.dateInFormat - input date string format using Date-fn
 *  patterns
 * @param {String} options.dateOutFormat - output date string format using
 *  Date-fn patterns
 * @param {String} options.futureDateError - message to return if future date is
 *  provided
 * @returns {CalculateAgeReturn}
 */
export const calculateAge = (
  dob,
  {
    dateInFormat = 'MM/dd/yyyy',
    dateOutFormat = 'MMMM d, yyyy',
    futureDateError = 'Date in the future',
  } = {},
) => {
  if (!dob) {
    return { age: 0, dobStr: '', labeledAge: '' };
  }

  const dobObj = parse(dob, dateInFormat, new Date());
  const dobStr = isValid(dobObj) ? format(dobObj, dateOutFormat) : '';
  const invalid = { age: 0, dobStr, labeledAge: '' };

  if (!dobStr) {
    return invalid;
  }

  const ageInYears = differenceInYears(new Date(), dobObj);
  if (ageInYears > 0) {
    return {
      age: ageInYears,
      dobStr,
      labeledAge: `${ageInYears} year${ageInYears > 1 ? 's' : ''} old`,
    };
  }

  // If less than 1 year old, show months
  const ageInMonths =
    ageInYears > 0 ? 0 : differenceInMonths(new Date(), dobObj);
  if (ageInMonths > 0) {
    return {
      age: 0,
      dobStr,
      labeledAge: `${ageInMonths} month${ageInMonths > 1 ? 's' : ''} old`,
    };
  }

  // If less than a month old, show days
  const ageInDays = ageInMonths > 0 ? 0 : differenceInDays(new Date(), dobObj);
  return ageInDays >= 0
    ? {
        age: 0,
        dobStr,
        labeledAge:
          ageInDays === 0
            ? 'Newborn'
            : `${ageInDays} day${ageInDays > 1 ? 's' : ''} old`,
      }
    : { age: 0, dobStr, labeledAge: futureDateError };
};

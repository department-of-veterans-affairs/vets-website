import {
  parse,
  isValid,
  differenceInYears,
  differenceInMonths,
  differenceInDays,
  format,
} from 'date-fns';

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

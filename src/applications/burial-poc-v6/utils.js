import { isBefore } from 'date-fns';
import { RadioLabels } from './constants';

export const isBeforeDate = (dateOne, dateTwo, validationMessage) => {
  return () =>
    isBefore(new Date(dateOne), new Date(dateTwo)) ? validationMessage : '';
};

export const stringToBoolean = value => {
  switch (value.toLowerCase().trim()) {
    case 'true':
    case 'yes':
    case '1':
      return true;
    case 'false':
    case 'no':
    case '0':
    case null:
      return false;
    default:
      return Boolean(value);
  }
};

/**
 *
 * To show a readable label on review page we extract label based on the value.
 * This method returns the label from value stored in formik.
 *
 * */
export const getRadioLabel = value => {
  return RadioLabels[value];
};

/**
 * A function to transform a dateString in the form yyyy-mm-dd into a javascript date object. This is necessary because
 * parsing the date string will result in a date one day before the expected value
 *
 * @param dateString
 */
export const parseDate = dateString => {
  const [yyyy, mm, dd] = dateString.split('-').map(str => parseInt(str, 10));
  return new Date(yyyy, mm - 1, dd);
};

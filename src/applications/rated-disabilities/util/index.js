import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/exports';
import { isValid, format, parseISO } from 'date-fns';

const SERVER_ERROR_REGEX = /^5\d{2}$/;
const CLIENT_ERROR_REGEX = /^4\d{2}$/;

export async function getData(apiRoute, options) {
  try {
    const response = await apiRequest(apiRoute, options);
    return response.data.attributes;
  } catch (error) {
    return error;
  }
}

export const isServerError = errCode => SERVER_ERROR_REGEX.test(errCode);

export const isClientError = errCode => CLIENT_ERROR_REGEX.test(errCode);

// Takes a format string and returns a function that formats the given date
// `date` must be in ISO format ex. 2020-01-28
export const buildDateFormatter = formatString => {
  return date => {
    const parsedDate = parseISO(date);

    return isValid(parsedDate)
      ? format(parsedDate, formatString)
      : 'Invalid date';
  };
};

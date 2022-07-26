import { apiRequest } from 'platform/utilities/api';
import { srSubstitute } from 'platform/forms-system/src/js/utilities/ui/mask-string';

const SERVER_ERROR_REGEX = /^5\d{2}$/;
const CLIENT_ERROR_REGEX = /^4\d{2}$/;

export const PAGE_TITLE = 'Your VA dependents';
export const TITLE_SUFFIX = ' | Veteran Affairs';

export async function getData(apiRoute, options) {
  try {
    const response = await apiRequest(apiRoute, options);
    return response.data.attributes;
  } catch (error) {
    return error;
  }
}

export function splitPersons(persons) {
  const dependentsOnAward = [];
  const dependentsNotOnAward = [];
  const allDependents = {};

  persons.forEach(person => {
    if (person.awardIndicator === 'N') {
      dependentsNotOnAward.push(person);
    } else {
      dependentsOnAward.push(person);
    }
    return true;
  });
  allDependents.onAward = dependentsOnAward;
  allDependents.notOnAward = dependentsNotOnAward;
  return allDependents;
}

export const isServerError = errCode => SERVER_ERROR_REGEX.test(errCode);

export const isClientError = errCode => CLIENT_ERROR_REGEX.test(errCode);

// separate each number so the screenreader reads "number ending with 1 2 3 4"
// instead of "number ending with 1,234"
export const mask = value => {
  const number = (value || '').toString().slice(-4);
  return srSubstitute(
    `●●●–●●–${number}`,
    `ending with ${number.split('').join(' ')}`,
  );
};

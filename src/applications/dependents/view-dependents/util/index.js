import { apiRequest } from 'platform/utilities/api';

const SERVER_ERROR_REGEX = /^5\d{2}$/;
const CLIENT_ERROR_REGEX = /^4\d{2}$/;

export const PAGE_TITLE = 'Your VA dependents';
export const TITLE_SUFFIX = ' | Veteran Affairs';

/**
 * Get data from API
 * @param {string} apiRoute - API URL
 * @param {object} options - fetch options
 * @returns {Promise<object|Error>} - API response data or error
 */
export async function getData(apiRoute, options) {
  try {
    const response = await apiRequest(apiRoute, options);
    return response.data?.attributes ? response.data.attributes : response;
  } catch (error) {
    return error;
  }
}

/**
 * @typedef {object} AllDependents
 * @property {Array} onAward - dependents on award
 * @property {Array} notOnAward - dependents not on award
 *
 * @typedef {object} AllDependentsResult
 * @property {Array} dependentsOnAward - list of awarded dependents
 * @property {Array} dependentsNotOnAward - list of non-awarded dependents
 *
 * @param {AllDependents} persons - list of all dependents
 * @returns {AllDependentsResult}  - separated dependents
 */
export function splitPersons(persons) {
  const dependentsOnAward = [];
  const dependentsNotOnAward = [];
  const allDependents = {};

  persons.forEach(person => {
    if (person?.awardIndicator === 'N') {
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

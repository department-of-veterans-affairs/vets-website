import mapValues from 'lodash/mapValues';
import { endOfDay, isValid, isWithinInterval } from 'date-fns';
import vaMedicalFacilities from 'vets-json-schema/dist/vaMedicalFacilities.json';

// map the facility list for each state into an array of strings
export const medicalCentersByState = mapValues(vaMedicalFacilities, val =>
  val.map(center => center.value),
);

/**
 * Helper that maps an array to an object literal to allow for
 * multiple keys to have the same value
 * @param {Array} arrayToMap - an array of arrays that defines the keys/values to map
 * @returns {Object} - an object literal
 */
export function createLiteralMap(arrayToMap) {
  return arrayToMap.reduce((obj, [value, keys]) => {
    for (const key of keys) {
      Object.defineProperty(obj, key, { value });
    }
    return obj;
  }, {});
}

/**
 * Helper that returns a descriptive aria label for the edit buttons on the
 * health insurance information page
 * @param {Object} formData - the current data object passed from the form
 * @returns {String} - the name of the provider and either the policy number
 * or group code.
 */
export function getInsuranceAriaLabel(formData) {
  const { insuranceName, insurancePolicyNumber, insuranceGroupCode } = formData;
  const labels = {
    policy: insurancePolicyNumber
      ? `Policy number ${insurancePolicyNumber}`
      : null,
    group: insuranceGroupCode ? `Group code ${insuranceGroupCode}` : null,
  };
  return insuranceName
    ? `${insuranceName}, ${labels.policy ?? labels.group}`
    : 'insurance policy';
}

/**
 * Helper that builds a full name string based on provided input values
 * @param {Object} name - the object that stores all the available input values
 * @param {Boolean} outputMiddle - optional param to declare whether to output
 * the middle name as part of the returned string
 * @returns {String} - the name string with all extra whitespace removed
 */
export function normalizeFullName(name = {}, outputMiddle = false) {
  const { first = '', middle = '', last = '', suffix = '' } = name;
  const nameToReturn = outputMiddle
    ? `${first} ${middle !== null ? middle : ''} ${last} ${suffix}`
    : `${first} ${last} ${suffix}`;
  return nameToReturn.replace(/ +(?= )/g, '').trim();
}

/**
 * Helper that builds a full name string based on provided input values
 * @param {String} birthdate - the value of the user's date of birth from the profile data
 * @returns {String/NULL} - NULL if the passed-in value is not valid else the
 * formatted string value of the date (YYYY-MM-DD)
 */
export function parseVeteranDob(birthdate) {
  if (!birthdate) return null;
  if (!isValid(new Date(birthdate))) return null;
  if (
    !isWithinInterval(new Date(birthdate), {
      start: new Date('1900-01-01'),
      end: endOfDay(new Date()),
    })
  )
    return null;
  return birthdate;
}

/**
 * Helper that takes query params and sets labels and return paths for
 * the multiresponse (list/loop) information pages
 * @param {Object} props - the original dataset, key name, localData object,
 * search index, view field object and ref item for the src array
 * @returns {Object} - the dataset to return
 */
export function getDataToSet(props) {
  const { slices, dataKey, localData, listRef, viewFields } = props;
  return localData === null
    ? { [dataKey]: listRef, [viewFields.report]: null, [viewFields.skip]: true }
    : {
        [dataKey]: [...slices.beforeIndex, localData, ...slices.afterIndex],
        [viewFields.report]: null,
        [viewFields.skip]: true,
      };
}

/**
 * Helper that takes query params and sets labels and return paths for
 * the multiresponse (list/loop) information pages
 * @param {Object} params - the URL Search Params object to query
 * @param {String} returnPath - the path to return upon completing an update action
 * @returns {Object} - the labels, returnPath and action mode
 */
export function getSearchAction(params, returnPath) {
  const mode = params.get('action') || 'add';
  return {
    mode,
    label: `${mode === 'add' ? 'add' : 'edit'}ing`,
    pathToGo: mode === 'update' ? '/review-and-submit' : `/${returnPath}`,
  };
}

/**
 * Helper that takes query params and looks for an associated index in the
 * provided array
 * @param {Object} params - the URL Search Params object to query
 * @param {Array} array - the array from which to find the index value
 * @returns {Number} - the desired index of the array
 */
export function getSearchIndex(params, array = []) {
  let indexToReturn = parseInt(params.get('index'), 10);
  if (Number.isNaN(indexToReturn) || indexToReturn > array.length) {
    indexToReturn = array.length;
  }
  return indexToReturn;
}

/**
 * Helper that determines the default dataset to use based on search params
 * @param {Object} props - the params to use to parse the default state
 * @returns {Object} - the parsed state data
 */
export function getDefaultState(props) {
  const {
    searchIndex,
    searchAction,
    defaultData = {},
    dataToSearch = [],
    name,
  } = props;
  const resultToReturn = { ...defaultData };

  // check if data exists at the array index and set return result accordingly
  if (typeof dataToSearch[searchIndex] !== 'undefined') {
    resultToReturn.data = dataToSearch[searchIndex];

    if (searchAction.mode !== 'add') {
      window.sessionStorage.setItem(name, searchIndex);
    }
  }

  return resultToReturn;
}

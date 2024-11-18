import mapValues from 'lodash/mapValues';
import { endOfDay, isAfter } from 'date-fns';
import vaMedicalFacilities from 'vets-json-schema/dist/vaMedicalFacilities.json';
import set from 'platform/utilities/data/set';
import recordEvent from 'platform/monitoring/record-event';
import {
  stringifyFormReplacer,
  filterViewFields,
  filterInactivePageData,
  getActivePages,
  expandArrayPages,
  createFormPageList,
} from 'platform/forms-system/src/js/helpers';
import { getInactivePages } from 'platform/forms/helpers';
import { HIGH_DISABILITY_MINIMUM } from '../constants';

// map necessary attachment data for submission
export function transformAttachments(data) {
  if (!data.attachments || !(data.attachments instanceof Array)) {
    return data;
  }
  const transformedAttachments = data.attachments.map(attachment => {
    const { name, size, confirmationCode, attachmentId } = attachment;
    return {
      name,
      size,
      confirmationCode,
      dd214: attachmentId === '1',
    };
  });
  return { ...data, attachments: transformedAttachments };
}

// strip, clean and map necessary data for submission
export function transform(formConfig, form) {
  const expandedPages = expandArrayPages(
    createFormPageList(formConfig),
    form.data,
  );
  const activePages = getActivePages(expandedPages, form.data);
  const inactivePages = getInactivePages(expandedPages, form.data);
  const withoutInactivePages = filterInactivePageData(
    inactivePages,
    activePages,
    form,
  );
  let withoutViewFields = filterViewFields(withoutInactivePages);
  const addressesMatch = form.data['view:doesMailingMatchHomeAddress'];

  // add back veteran name, dob & ssn, because it could have been removed in filterInactivePages
  const veteranFields = [
    'veteranFullName',
    'veteranDateOfBirth',
    'veteranSocialSecurityNumber',
  ];
  veteranFields.forEach(field => {
    if (!withoutViewFields[field]) {
      const fieldData =
        form.loadedData.formData[field] ||
        form['view:veteranInformation'][field];
      withoutViewFields = set(field, fieldData, withoutViewFields);
    }
  });

  // add back & double check compensation type because it could have been removed in filterInactivePages
  if (!withoutViewFields.vaCompensationType) {
    const userDisabilityRating = parseInt(
      form.data['view:totalDisabilityRating'],
      10,
    );
    const compensationType =
      userDisabilityRating >= HIGH_DISABILITY_MINIMUM
        ? 'highDisability'
        : form.data.vaCompensationType;
    withoutViewFields = set(
      'vaCompensationType',
      compensationType,
      withoutViewFields,
    );
  }

  // parse dependents list here, because it could have been removed in filterViewFields
  if (withoutViewFields.dependents?.length) {
    const listToSet = withoutViewFields.dependents.map(item => ({
      ...item,
      grossIncome: item.grossIncome || 0,
      netIncome: item.netIncome || 0,
      otherIncome: item.otherIncome || 0,
      dependentEducationExpenses: item.dependentEducationExpenses || 0,
    }));
    withoutViewFields = set('dependents', listToSet, withoutViewFields);
  } else {
    withoutViewFields = set('dependents', [], withoutViewFields);
  }

  // convert `attachmentId` values to a `dd214` boolean
  if (withoutViewFields.attachments) {
    withoutViewFields = transformAttachments(withoutViewFields);
  }

  // duplicate address before submit if they are the same
  if (addressesMatch) {
    withoutViewFields.veteranHomeAddress = withoutViewFields.veteranAddress;
  }

  const formData =
    JSON.stringify(withoutViewFields, (key, value) => {
      // Don’t let dependents be removed in the normal empty object clean up
      if (key === 'dependents') {
        return value;
      }

      return stringifyFormReplacer(key, value);
    }) || '{}';

  let gaClientId;
  try {
    // eslint-disable-next-line no-undef
    gaClientId = ga.getAll()[0].get('clientId');
  } catch (e) {
    // don't want to break submitting because of a weird GA issue
  }

  // use logging to track volume of forms submitted with future discharge dates
  const { lastDischargeDate } = form.data;
  if (
    lastDischargeDate &&
    isAfter(new Date(lastDischargeDate), endOfDay(new Date()))
  ) {
    recordEvent({
      event: 'hca-future-discharge-date-submission',
    });
  }

  // use logging to track volume of forms submitted with SIGI question answered
  if (form.data.sigiGenders && form.data.sigiGenders !== 'NA') {
    recordEvent({
      event: 'hca-submission-with-sigi-value',
    });
  }

  return JSON.stringify({
    gaClientId,
    asyncCompatible: true,
    form: formData,
  });
}

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

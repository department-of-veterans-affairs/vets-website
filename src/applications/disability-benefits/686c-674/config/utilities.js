import fullSchema from 'vets-json-schema/dist/686C-674-schema.json';
import _ from 'platform/utilities/data';
import { validateWhiteSpace } from 'platform/forms/validations';
import {
  filterInactivePageData,
  getActivePages,
  getInactivePages,
  stringifyFormReplacer,
  expandArrayPages,
  createFormPageList,
} from 'platform/forms-system/src/js/helpers';
import { apiRequest } from 'platform/utilities/api';

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

const isServerError = errCode => SERVER_ERROR_REGEX.test(errCode);

const isClientError = errCode => CLIENT_ERROR_REGEX.test(errCode);

const validateName = (errors, pageData) => {
  const { first, last } = pageData;
  validateWhiteSpace(errors.first, first);
  validateWhiteSpace(errors.last, last);
};

/**
 * Mostly copied from the platform provided stringifyFormReplacer, with the removal of the address check. We don't need it here for our location use.
 */
const customFormReplacer = (key, value) => {
  // clean up empty objects, which we have no reason to send
  if (typeof value === 'object') {
    const fields = Object.keys(value);
    if (
      fields.length === 0 ||
      fields.every(field => value[field] === undefined)
    ) {
      return undefined;
    }

    // autosuggest widgets save value and label info, but we should just return the value
    if (value.widget === 'autosuggest') {
      return value.id;
    }

    // Exclude file data
    if (value.confirmationCode && value.file) {
      return _.omit('file', value);
    }
  }

  // Clean up empty objects in arrays
  if (Array.isArray(value)) {
    const newValues = value.filter(v => !!stringifyFormReplacer(key, v));
    // If every item in the array is cleared, remove the whole array
    return newValues.length > 0 ? newValues : undefined;
  }

  return value;
};

const {
  optionSelection,
  veteranInformation,
  addChild,
  addSpouse,
  reportDivorce,
  deceasedDependents,
  reportChildMarriage,
  reportChildStoppedAttendingSchool,
  reportStepchildNotInHousehold,
  report674,
} = fullSchema.properties;

export {
  validateName,
  optionSelection,
  veteranInformation,
  addChild,
  addSpouse,
  reportDivorce,
  deceasedDependents,
  reportChildMarriage,
  reportChildStoppedAttendingSchool,
  reportStepchildNotInHousehold,
  report674,
  isServerError,
  isClientError,
};

export function customTransformForSubmit(formConfig, form) {
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
  return JSON.stringify(withoutInactivePages, customFormReplacer) || '{}';
}

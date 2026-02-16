import { isEqual } from 'lodash';
import { isInMPI, isLoggedIn, selectProfile } from 'platform/user/selectors';
import set from 'platform/utilities/data/set';
import { FULL_SCHEMA } from '../utils/imports';
import { validateDateOfBirth } from '../utils/validation';

/**
 * Validates and removes invalid phone numbers from form data
 * Veteran Enrollment System (VES) requires 10-digit US phone numbers, but VA Profile may contain international formats
 * Remove any phone numbers that don't match the required pattern (^[0-9]{10}$) as defined in vets-json-schema
 * @param {Object} formData - the form data object
 * @param {Object} dataToReturn - the data object being built
 * @returns {Object} - updated data object
 */
const validatePhoneNumbers = (formData, dataToReturn) => {
  let updatedData = dataToReturn;

  for (const phoneField of ['homePhone', 'mobilePhone']) {
    const phoneNumber = formData[phoneField];
    const phoneNumberRegex = new RegExp(
      FULL_SCHEMA.properties[phoneField].pattern,
    );

    if (phoneNumber && !phoneNumberRegex.test(phoneNumber)) {
      updatedData = set(phoneField, undefined, updatedData);
    }
  }

  return updatedData;
};

/**
 * Validates and sets veteran date of birth if present
 * @param {Object} formData - the form data object
 * @param {Object} dataToReturn - the data object being built
 * @returns {Object} - updated data object
 */
const validateVeteranDateOfBirth = (formData, dataToReturn) => {
  if (formData.veteranDateOfBirth) {
    return set(
      'veteranDateOfBirth',
      validateDateOfBirth(formData.veteranDateOfBirth),
      dataToReturn,
    );
  }
  return dataToReturn;
};

/**
 * Map address object to match the key names in the schema
 * @param {Array} address - an object with street address data
 * @returns {Object} - an object of properly-formatted address data
 */
const sanitizeAddress = address => {
  if (!address) return null;

  const {
    addressLine1,
    addressLine2,
    addressLine3,
    city,
    zipCode,
    stateCode,
    countryCodeIso3,
  } = address;

  return {
    street: addressLine1,
    street2: addressLine2 || undefined,
    street3: addressLine3 || undefined,
    city,
    state: stateCode,
    postalCode: zipCode,
    country: countryCodeIso3,
  };
};

/**
 * Map necessary data from prefill to populate initial form data
 * @param {Array} pages - the array of form pages
 * @param {Object} formData - the form data object
 * @param {Object} metadata - the form metadata object
 * @param {Object} state - all Redux state values
 * @returns {Object} - an object containing form pages array, form metadata
 * and updated form data
 */
export const prefillTransformer = (pages, formData, metadata, state) => {
  const { vapContactInfo } = selectProfile(state);
  const { mailingAddress, residentialAddress } = vapContactInfo;
  const veteranHomeAddress = sanitizeAddress(residentialAddress);
  const veteranAddress = sanitizeAddress(mailingAddress);
  const hasAddressMatch = isEqual(veteranAddress, veteranHomeAddress);
  const parsedAddressMatch =
    veteranAddress && veteranHomeAddress ? hasAddressMatch : undefined;
  let dataToReturn = formData;

  const isUserLoggedIn = isLoggedIn(state) || false;
  dataToReturn = set('view:isLoggedIn', isUserLoggedIn, dataToReturn);

  if (isInMPI(state)) {
    dataToReturn = set('view:isUserInMvi', true, dataToReturn);
  }

  if (veteranAddress) {
    dataToReturn = set('veteranAddress', veteranAddress, dataToReturn);
  }

  if (veteranHomeAddress && !hasAddressMatch) {
    dataToReturn = set('veteranHomeAddress', veteranHomeAddress, dataToReturn);
  }

  dataToReturn = validatePhoneNumbers(formData, dataToReturn);
  dataToReturn = validateVeteranDateOfBirth(formData, dataToReturn);

  dataToReturn = set(
    'view:doesMailingMatchHomeAddress',
    parsedAddressMatch,
    dataToReturn,
  );

  return { pages, metadata, formData: dataToReturn };
};

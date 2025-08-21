import { isEqual } from 'lodash';
import { isInMPI, selectProfile } from 'platform/user/selectors';
import set from 'platform/utilities/data/set';

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

  if (isInMPI(state)) {
    dataToReturn = set('view:isUserInMvi', true, dataToReturn);
  }

  if (veteranAddress) {
    dataToReturn = set('veteranAddress', veteranAddress, dataToReturn);
  }

  if (veteranHomeAddress && !hasAddressMatch) {
    dataToReturn = set('veteranHomeAddress', veteranHomeAddress, dataToReturn);
  }

  dataToReturn = set(
    'view:doesMailingMatchHomeAddress',
    parsedAddressMatch,
    dataToReturn,
  );

  return { pages, metadata, formData: dataToReturn };
};

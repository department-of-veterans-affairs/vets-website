import omit from 'platform/utilities/data/omit';
import { MILITARY_CITIES } from '../constants';
import { wrapInSingleArray } from './array-builder';

/**
 * Map address object to match the key names in the schema
 * @param {Array} address - an array of arrays that defines the keys/values to map
 * @returns {Object} - an object of properly-formatted address data
 */
export function sanitizeAddress(address) {
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
    isMilitary: MILITARY_CITIES.includes(city),
    street: addressLine1,
    street2: addressLine2 || undefined,
    street3: addressLine3 || undefined,
    city,
    postalCode: zipCode,
    state: stateCode,
    country: countryCodeIso3,
  };
}

/**
 * Map necessary data from prefill to populate initial form data
 * NOTE: mailingAddress === veteranAddress & residentialAddress === veteranHomeAddress
 * @param {Array} pages - an array of form pages
 * @param {Object} formData - the form data object
 * @param {Object} metadata - the form metadata object
 * @param {Object} state - all Redux state values
 * @returns {Object} - an object containing form pages array, form metadata and form data
 */
export function prefillTransformer(pages, formData, metadata, state) {
  const {
    user: {
      profile: {
        vapContactInfo: { residentialAddress, mailingAddress },
      },
    },
  } = state;
  const veteranHomeAddress = sanitizeAddress(residentialAddress);
  const veteranAddress = sanitizeAddress(mailingAddress);
  const doesAddressMatch =
    JSON.stringify(veteranHomeAddress) === JSON.stringify(veteranAddress);
  const parsedAddressMatch =
    veteranAddress && veteranHomeAddress ? doesAddressMatch : undefined;

  // omit data values that belong in a viewfield
  const withoutViewFields = omit(
    [
      'email',
      'homePhone',
      'maritalStatus',
      'isMedicaidEligible',
      'isEnrolledMedicarePartA',
    ],
    formData,
  );

  const {
    email,
    homePhone,
    maritalStatus,
    isMedicaidEligible,
    isEnrolledMedicarePartA,
  } = formData;

  let newData = {
    ...withoutViewFields,
    'view:contactInformation': { email, homePhone },
    'view:maritalStatus': { maritalStatus },
    'view:isMedicaidEligible': { isMedicaidEligible },
    'view:isEnrolledMedicarePartA': { isEnrolledMedicarePartA },
    'view:doesMailingMatchHomeAddress': parsedAddressMatch,
  };

  if (veteranAddress) {
    newData = { ...newData, veteranAddress };
  }

  if (veteranHomeAddress && !doesAddressMatch) {
    newData = { ...newData, veteranHomeAddress };
  }

  // Wrap necessary data in nested arrays for prefill.
  newData = wrapInSingleArray(newData, state);

  return {
    metadata,
    formData: newData,
    pages,
  };
}

/**
 * Map necessary data from prefill to populate initial form data
 * @param {Array} pages - an array of form pages
 * @param {Object} formData - the form data object
 * @param {Object} metadata - the form metadata object
 * @param {Object} state - all Redux state values
 * @returns {Object} - an object containing form pages array, form metadata and form data
 */
export function prefillTransformer(pages, formData, metadata, state) {
  const { dob, userFullName, vapContactInfo } = state.user.profile;
  const {
    countryCodeIso3,
    addressLine1,
    addressLine2,
    addressLine3,
    city,
    stateCode,
    zipCode,
  } = vapContactInfo.mailingAddress || {};

  const safeUserFullName = {
    first: userFullName?.first ?? '',
    middle: userFullName?.middle ?? '',
    last: userFullName?.last ?? '',
    suffix: userFullName?.suffix ?? '',
  };

  const newData = {
    ...formData,
    dob,
    fullName: safeUserFullName,
    veteranAddress: {
      country: countryCodeIso3,
      street: addressLine1,
      street2: addressLine2,
      street3: addressLine3,
      city,
      state: stateCode,
      postalCode: zipCode,
    },
  };

  return {
    metadata,
    formData: newData,
    pages,
  };
}

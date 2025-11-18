/**
 * Helper to test if the spouse item is in an incomplete state.
 *
 * The spouse section has a few required fields that are always required, and some that are only required if the spouse does not have the same address, or if they provide support last year.
 *
 * @param {Object} item - The spouse item.
 * @returns {boolean} - Returns true if the required fields are missing.
 */
export const isItemIncomplete = item => {
  // Always required fields.
  const missingRequiredFields =
    !item?.spouseFullName?.first ||
    !item?.spouseFullName?.last ||
    !item?.spouseSocialSecurityNumber ||
    !item?.spouseDateOfBirth ||
    !item?.dateOfMarriage ||
    item?.cohabitedLastYear === undefined ||
    item?.sameAddress === undefined;

  if (missingRequiredFields) {
    return true;
  }

  // Financial support response is only required if spouse did not cohabitate last year.
  const missingFinancialSupportFields =
    item?.cohabitedLastYear === false &&
    item?.provideSupportLastYear === undefined;
  if (missingFinancialSupportFields) {
    return true;
  }

  // Contact information is only required if spouse does not have the same address.
  if (item?.sameAddress === false) {
    const addressFields = ['street', 'city', 'state', 'country', 'postalCode'];
    const missingContactFields = addressFields.some(
      field => !item?.spouseAddress?.[field],
    );
    if (missingContactFields) {
      return true;
    }
  }

  return false;
};

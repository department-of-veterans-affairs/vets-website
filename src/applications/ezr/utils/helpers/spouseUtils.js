import { isAfter } from 'date-fns';

/**
 * Helper to test if the spouse item is in an incomplete state.
 *
 * The spouse section has a few required fields that are always required, and some that are only required if the spouse does not have the same address, or if they provide support last year.
 *
 * @param {Object} item - The spouse item.
 * @returns {boolean} - Returns true if the required fields are missing/invalid.
 */
export const isItemIncomplete = item => {
  // Always required fields.
  const firstName = item?.spouseFullName?.first;
  const lastName = item?.spouseFullName?.last;
  const dateOfMarriage = item?.dateOfMarriage;
  const spouseDateOfBirth = item?.spouseDateOfBirth;
  const missingRequiredFields =
    !firstName ||
    !lastName ||
    !item?.spouseSocialSecurityNumber ||
    !spouseDateOfBirth ||
    !dateOfMarriage ||
    item?.cohabitedLastYear === undefined ||
    item?.sameAddress === undefined;

  if (missingRequiredFields) {
    return true;
  }

  // identity field validation
  if (
    isAfter(new Date(1900, 1, 1), new Date(spouseDateOfBirth)) ||
    isAfter(new Date(1900, 1, 1), new Date(dateOfMarriage)) ||
    isAfter(new Date(spouseDateOfBirth), new Date(dateOfMarriage))
  ) {
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

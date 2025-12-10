import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';

/**
 * Helper to test if the spouse item is in an incomplete state.
 *
 * The spouse section has a few required fields that are always required, and some that are only required if the spouse does not have the same address, or if they provide support last year.
 *
 * @param {Object} item - The spouse item.
 * @returns {boolean} - Returns true if the required fields are missing.
 */
export const isItemIncomplete = item => {
  const { spouseFullName, spouseSocialSecurityNumber } = ezrSchema.properties;

  // Always required fields.
  const firstName = item?.spouseFullName?.first;
  const lastName = item?.spouseFullName?.last;
  const missingRequiredFields =
    !firstName ||
    !lastName ||
    !item?.spouseSocialSecurityNumber ||
    !item?.spouseDateOfBirth ||
    !item?.dateOfMarriage ||
    item?.cohabitedLastYear === undefined ||
    item?.sameAddress === undefined;

  if (missingRequiredFields) {
    return true;
  }

  // identity field validation
  const fullNameProps = spouseFullName.properties;
  const middleName = item?.spouseFullName?.middle;
  const suffix = item?.spouseFullName?.suffix;
  const doesNotMatch = (prop, val) => !new RegExp(prop.pattern).test(val);

  if (
    firstName?.length > fullNameProps.first.maxLength ||
    middleName?.length > fullNameProps.middle.maxLength ||
    lastName?.length < fullNameProps.last.minLength ||
    lastName?.length > fullNameProps.last.maxLength ||
    doesNotMatch(fullNameProps.first, firstName) ||
    doesNotMatch(fullNameProps.middle, middleName) ||
    doesNotMatch(fullNameProps.last, lastName) ||
    (suffix && !fullNameProps.suffix.enum.includes(suffix)) ||
    doesNotMatch(spouseSocialSecurityNumber, item?.spouseSocialSecurityNumber)
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

import {
  stringifyFormReplacer,
  filterViewFields,
  filterInactivePageData,
  getActivePages,
  expandArrayPages,
  createFormPageList,
} from 'platform/forms-system/src/js/helpers';
import set from 'platform/utilities/data/set';
import { getInactivePages } from 'platform/forms/helpers';
import { includeHouseholdInformationWithV2Prefill } from './form-config';

/**
 * Maps & format form data to ensure submission matches schema needs
 * @param {Object} formConfig - the form data object
 * @param {Object} form - the form object from state
 * @returns {Object} - an object literal
 */
export function submitTransformer(formConfig, form) {
  const { data: formData, loadedData } = form;
  let financialInformation;

  /*
  due to how the ArrayBuilder works, we need to take the first item in
  the 'financialInformation' array and flatten it so only the key/value pairs
  are left
  */
  if (
    includeHouseholdInformationWithV2Prefill(formData) &&
    formData.financialInformation?.length > 0
  ) {
    // clone the original data to avoid mutating it directly
    const clonedFormData = { ...formData };
    const flattenedFinancialInformation = {};
    const data = clonedFormData.financialInformation[0];

    Object.keys(data).forEach(financialInfoKey => {
      const value = Object.values(data[financialInfoKey])[0];
      // remove the view prefix from the key
      const keyWithoutViewPrefix = financialInfoKey.replace(/^view:/, '');
      flattenedFinancialInformation[keyWithoutViewPrefix] = value;
      /*
      due to the feature toggle and still having V1 financial pages, we need
      to delete the V1 view fields from the form data
      */
      delete formData[financialInfoKey];
    });

    delete formData.financialInformation;

    // wrap in a data object
    financialInformation = flattenedFinancialInformation;
  }

  const expandedPages = expandArrayPages(
    createFormPageList(formConfig),
    formData,
  );
  const activePages = getActivePages(expandedPages, formData);
  const inactivePages = getInactivePages(expandedPages, formData);
  const withoutInactivePages = filterInactivePageData(
    inactivePages,
    activePages,
    form,
  );
  let withoutViewFields = filterViewFields(withoutInactivePages);
  let gaClientId;

  // set veteran data fields to loaded profile data if its removed in filterInactivePageData
  const veteranFields = ['veteranDateOfBirth', 'gender'];
  veteranFields.forEach(field => {
    if (!withoutViewFields[field]) {
      const fieldData = loadedData.formData[field];
      withoutViewFields = set(field, fieldData, withoutViewFields);
    }
  });

  // set mailing address as home address if view field is `true`
  if (formData['view:doesMailingMatchHomeAddress']) {
    withoutViewFields = set(
      'veteranHomeAddress',
      withoutViewFields.veteranAddress,
      withoutViewFields,
    );
  }

  // parse dependents list for required field data
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

  // add the financial information
  if (financialInformation) {
    withoutViewFields = { ...withoutViewFields, ...financialInformation };
  }

  const newData = JSON.stringify(withoutViewFields, (key, value) => {
    // dont let dependents be removed in the normal empty value clean up
    if (key === 'dependents') return value;
    return stringifyFormReplacer(key, value);
  });

  try {
    // eslint-disable-next-line no-undef
    gaClientId = ga.getAll()[0].get('clientId');
  } catch (e) {
    // lets not break submitting because of any GA bugs
  }

  return JSON.stringify({
    asyncCompatible: true,
    form: newData,
    gaClientId,
  });
}

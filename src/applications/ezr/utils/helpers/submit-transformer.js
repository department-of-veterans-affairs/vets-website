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

/**
 * Maps & format form data to ensure submission matches schema needs
 * @param {Object} formConfig - the form data object
 * @param {Object} form - the form object from state
 * @returns {Object} - an object literal
 */
export function submitTransformer(formConfig, form) {
  const { data: formData } = form;
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

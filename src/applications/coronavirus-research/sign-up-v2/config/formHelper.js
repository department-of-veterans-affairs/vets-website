import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import recordEvent from 'platform/monitoring/record-event';

let checkBoxElements = [
  'HEALTH_HISTORY',
  'TRANSPORTATION',
  'EMPLOYMENT_STATUS',
  'VETERAN',
  'GENDER',
  'RACE_ETHNICITY',
];
const checkBoxParents = ['diagnosed'];
const checkBoxChildren = ['DIAGNOSED_DETAILS', 'DIAGNOSED_SYMPTOMS'];

const NONE_OF_ABOVE = 'NONE_OF_ABOVE';

export const setNoneOfAbove = (form, elementName, elementNOA) => {
  const updatedForm = form;
  Object.keys(updatedForm[elementName]).map((key, _val) => {
    updatedForm[elementName][key] = false;
    updatedForm[elementName][elementNOA] = true;
    return updatedForm;
  });
};
export function updateData(oldForm, newForm) {
  const updatedForm = newForm;
  checkBoxElements.forEach(elementName => {
    // For each checkBoxGroup in the form, get the number of selected elements before and after the current event
    const oldSelectedCount = Object.keys(oldForm[elementName]).filter(
      val => oldForm[elementName][val] === true,
    ).length;
    const newSelectedCount = Object.keys(newForm[elementName]).filter(
      val => newForm[elementName][val] === true,
    ).length;

    const elementNOA = `${elementName}::${NONE_OF_ABOVE}`;
    // if no change just return
    if (oldSelectedCount === newSelectedCount) return;
    if (newSelectedCount === 0) updatedForm[elementName][elementNOA] = true;
    // When there are 2 selected, need to know if the user just selected NONE_OF_ABOVE of a new selection
    else if (newSelectedCount === 2) {
      const oldNoResp = oldForm[elementName][elementNOA];
      const newNoResp = newForm[elementName][elementNOA];
      if (oldNoResp !== newNoResp) {
        setNoneOfAbove(updatedForm, elementName, elementNOA);
      } else {
        updatedForm[elementName][elementNOA] = false;
      }
    } else if (
      // if NONE_OF_ABOVE is selected clear out all others
      newSelectedCount > 2 &&
      newForm[elementName][elementNOA] === true
    ) {
      setNoneOfAbove(updatedForm, elementName, elementNOA);
    }
  });

  checkBoxParents.forEach(elementName => {
    const wasDiagnosed = oldForm[elementName];
    const isDiagnosed = newForm[elementName];
    const childCount = checkBoxChildren.length;
    if (wasDiagnosed === isDiagnosed) return;
    if (isDiagnosed === true) {
      checkBoxElements = checkBoxElements.concat(checkBoxChildren);
    } else if (isDiagnosed === false) {
      checkBoxElements.splice(-childCount, childCount);
    }
  });

  return updatedForm;
}

export function transform(formConfig, form) {
  const transformedForm = form;
  checkBoxElements.forEach(elementName => {
    Object.keys(form.data[elementName])
      .filter(key => form.data[elementName][key] === undefined)
      .forEach(filteredKey => {
        transformedForm.data[elementName][filteredKey] = false;
      });
  });
  return transformForSubmit(formConfig, transformedForm);
}

export const recordAnalyticsEvent = (
  trackingPrefix,
  type,
  label,
  value,
  action,
) => {
  recordEvent({
    event: `${trackingPrefix}-form-change`,
    'form-field-type': type, // i.e 'form-radio-buttons', 'form-checkbox', 'form-datefield-day'
    'form-field-label': label, // i.e 'Have you ever been diagnosed with COVID-19?'
    'form-field-value': value, // i.e 'Yes' or 'No',
    'form-field-action': action, // 'clicked', 'checked', 'unchecked', 'changed'
  });
};

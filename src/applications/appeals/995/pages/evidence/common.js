import {
  PRIVATE_TREATMENT_LOCATION_KEY,
  VA_TREATMENT_LOCATION_KEY,
} from '../../constants';

const getConditionQuestion = (data, key) =>
  data?.[key]
    ? `What conditions were you treated for at ${data[key]}?`
    : 'What conditions were you treated for?';

const getEditConditionQuestion = (data, key) =>
  data?.[key]
    ? `the conditions you were treated for at ${data[key]}`
    : 'the conditions you were treated for';

export const issuesContent = {
  question: (evidenceType, formData, addOrEdit) => {
    const key =
      evidenceType === 'va'
        ? VA_TREATMENT_LOCATION_KEY
        : PRIVATE_TREATMENT_LOCATION_KEY;

    if (addOrEdit === 'add') {
      return getConditionQuestion(formData, key);
    }

    return getEditConditionQuestion(formData, key);
  },
  label: 'Select all the service-connected conditions you were treated for',
  requiredError: 'Select a condition',
};

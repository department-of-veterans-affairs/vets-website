import { getArrayUrlSearchParams } from 'platform/forms-system/src/js/patterns/array-builder/helpers';

import { conditionObjects } from '../../content/conditionOptions';

export const createDefaultAndEditTitles = (defaultTitle, editTitle) => {
  const search = getArrayUrlSearchParams();
  const isEdit = search.get('edit');

  if (isEdit) {
    return editTitle;
  }
  return defaultTitle;
};

// Different than lodash _capitalize because does not make rest of string lowercase which would break acronyms
export const capitalizeFirstLetter = string => {
  return string?.charAt(0).toUpperCase() + string?.slice(1);
};

export const createItemName = (item, capFirstLetter = false) => {
  const condition = capFirstLetter
    ? capitalizeFirstLetter(item?.condition)
    : item?.condition || 'condition';

  if (item?.sideOfBody) {
    return `${condition}, ${item?.sideOfBody.toLowerCase()}`;
  }

  return condition;
};

/** @type {ArrayBuilderOptions} */
export const arrayBuilderOptions = {
  arrayPath: 'conditionsFirst',
  nounSingular: 'condition',
  nounPlural: 'conditions',
  required: true,
  isItemIncomplete: item => !item?.condition,
  maxItems: 100,
  text: {
    getItemName: item => createItemName(item, true),
  },
};

// TODO: [Fix the formData prop on edit so that it contains all form data](https://github.com/department-of-veterans-affairs/vagov-claim-classification/issues/689)
// formData contains all form data on add and only item data on edit which results in the need for the conditional below
export const hasSideOfBody = (formData, index) => {
  const condition = formData?.[arrayBuilderOptions.arrayPath]
    ? formData?.[arrayBuilderOptions.arrayPath][index]?.condition
    : formData.condition;

  const conditionObject = conditionObjects.find(
    conditionObj => conditionObj.option === condition,
  );

  return conditionObject ? conditionObject.sideOfBody : false;
};

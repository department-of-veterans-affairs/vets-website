import { conditionObjects } from '../../content/conditionOptions';

const createCauseDescriptions = item => {
  return {
    NEW: 'Caused by an injury or exposure during my service.',
    SECONDARY: `Caused by ${item?.causedByCondition}.`,
    WORSENED:
      'Existed before I served in the military, but got worse because of my military service.',
    VA:
      'Caused by an injury or event that happened when I was receiving VA care.',
  };
};

const causeFollowUpChecks = {
  NEW: item => !item?.primaryDescription,
  SECONDARY: item =>
    !item?.causedByCondition || !item?.causedByConditionDescription,
  WORSENED: item => !item?.worsenedDescription || !item?.worsenedEffects,
  VA: item => !item?.vaMistreatmentDescription || !item?.vaMistreatmentLocation,
};

export const hasSideOfBody = (formData, index) => {
  const condition = formData?.newConditions
    ? formData.newConditions[index]?.condition
    : formData.condition;

  const conditionObject = conditionObjects.find(
    conditionObj => conditionObj.option === condition,
  );

  return conditionObject ? conditionObject.sideOfBody : false;
};

// Different than lodash _capitalize because does not make rest of string lowercase which would break acronyms
const capitalizeFirstLetter = string => {
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
  arrayPath: 'newConditions',
  nounSingular: 'condition',
  nounPlural: 'conditions',
  required: true,
  isItemIncomplete: item =>
    !item?.condition ||
    (hasSideOfBody(item) && !item?.sideOfBody) ||
    !item?.date ||
    !item?.cause ||
    (causeFollowUpChecks[item.cause] && causeFollowUpChecks[item.cause](item)),
  maxItems: 100,
  text: {
    getItemName: item => createItemName(item, true),
    cardDescription: item => createCauseDescriptions(item)[(item?.cause)],
  },
};

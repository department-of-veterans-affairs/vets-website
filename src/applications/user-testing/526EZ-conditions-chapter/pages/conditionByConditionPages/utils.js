import { format } from 'date-fns';
import { getUrlPathIndex } from 'platform/forms-system/src/js/helpers';
import {
  getArrayIndexFromPathName,
  getArrayUrlSearchParams,
} from 'platform/forms-system/src/js/patterns/array-builder/helpers';

import { NULL_CONDITION_STRING } from '../../constants';
import { conditionObjects } from '../../content/conditionOptions';

const arrayPath = 'conditionByCondition';

export const isActiveDemo = (formData, currentDemo) =>
  formData.demo === currentDemo;

const checkNewConditionRadio = ratedDisability =>
  !ratedDisability ||
  ratedDisability === 'Add a new condition' ||
  ratedDisability === 'Edit new condition';

export const isNewCondition = (formData, index) => {
  if (formData?.[arrayPath]) {
    const ratedDisability = formData?.[arrayPath]?.[index]?.ratedDisability;

    return checkNewConditionRadio(ratedDisability);
  }

  return checkNewConditionRadio(formData?.ratedDisability);
};

export const hasCause = (formData, index, cause) =>
  formData?.[arrayPath]?.[index]?.cause === cause;

export const createDefaultAndEditTitles = (defaultTitle, editTitle) => {
  const search = getArrayUrlSearchParams();
  const isEdit = search.get('edit');

  if (isEdit) {
    return editTitle;
  }
  return defaultTitle;
};

export const createNonSelectedRatedDisabilities = fullData => {
  const currentIndex = getArrayIndexFromPathName();
  const selectedRatedDisabilities = [];

  fullData?.[arrayPath]?.forEach((item, index) => {
    if (index !== currentIndex) {
      selectedRatedDisabilities.push(item?.ratedDisability);
    }
  });

  const nonSelectedRatedDisabilities = {};

  fullData?.ratedDisabilities?.forEach(disability => {
    if (!selectedRatedDisabilities?.includes(disability.name)) {
      nonSelectedRatedDisabilities[disability.name] = disability.name;
    }
  });

  return nonSelectedRatedDisabilities;
};

export const hasRemainingRatedDisabilities = fullData => {
  if (fullData?.ratedDisabilities?.length === 0) {
    return false;
  }

  return Object.keys(createNonSelectedRatedDisabilities(fullData)).length > 0;
};

// Different than lodash _capitalize because does not make rest of string lowercase which would break acronyms
const capitalizeFirstLetter = string => {
  return string?.charAt(0).toUpperCase() + string?.slice(1);
};

export const createItemName = (item, capFirstLetter = false) => {
  if (!isNewCondition(item)) {
    return item?.ratedDisability;
  }

  const newCondition = capFirstLetter
    ? capitalizeFirstLetter(item?.newCondition)
    : item?.newCondition || 'condition';

  if (item?.sideOfBody) {
    return `${newCondition}, ${item?.sideOfBody.toLowerCase()}`;
  }

  return newCondition;
};

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

const isItemIncomplete = item => {
  if (!isNewCondition(item)) {
    return !item?.ratedDisability;
  }

  return (
    !item?.newCondition || !item?.cause || causeFollowUpChecks[item.cause](item)
  );
};

export function formatYearMonth(dateString) {
  if (!dateString) {
    return '';
  }

  const [year, month] = dateString.split('-').map(Number);
  return format(new Date(year, month - 1), 'MMMM yyyy');
}

const cardDescription = item => {
  if (!isNewCondition(item)) {
    let ratedDisabilityDescription = 'Claim for increase';

    if (item?.ratedDisabilityDate) {
      ratedDisabilityDescription += `; worsened ${formatYearMonth(
        item?.ratedDisabilityDate,
      )}`;
    }

    return ratedDisabilityDescription;
  }

  let newConditionDescription = 'New condition';

  if (item?.newConditionDate) {
    newConditionDescription += `; started ${formatYearMonth(
      item?.newConditionDate,
    )}`;
  }

  newConditionDescription += `; ${
    createCauseDescriptions(item)[(item?.cause)]
  }`;

  return newConditionDescription;
};

/** @type {ArrayBuilderOptions} */
export const arrayBuilderOptions = {
  arrayPath,
  nounSingular: 'condition',
  nounPlural: 'conditions',
  required: true,
  isItemIncomplete,
  maxItems: 100,
  text: {
    getItemName: item => createItemName(item, true),
    cardDescription,
  },
};

export const missingConditionMessage =
  'Enter a condition, diagnosis, or short description of your symptoms';

const regexNonWord = /[^\w]/g;
const generateSaveInProgressId = str =>
  (str || 'blank').replace(regexNonWord, '').toLowerCase();

const validateLength = (err, fieldData) => {
  if (fieldData.length > 255) {
    err.addError('This needs to be less than 256 characters');
  }
};

const validateNotMissing = (err, fieldData) => {
  const isMissingCondition =
    !fieldData?.trim() ||
    fieldData.toLowerCase() === NULL_CONDITION_STRING.toLowerCase();

  if (isMissingCondition) {
    err.addError(missingConditionMessage);
  }
};

const validateNotDuplicate = (err, fieldData, formData, path) => {
  const index = getUrlPathIndex(window.location.pathname);

  const lowerCasedConditions =
    formData?.[path]?.map(condition => condition.newCondition?.toLowerCase()) ||
    [];

  const fieldDataLowerCased = fieldData?.toLowerCase() || '';
  const fieldDataSaveInProgressId = generateSaveInProgressId(fieldData || '');

  const hasDuplicate = lowerCasedConditions.some((condition, i) => {
    if (index === i) return false;

    return (
      condition === fieldDataLowerCased ||
      generateSaveInProgressId(condition) === fieldDataSaveInProgressId
    );
  });

  if (hasDuplicate) {
    err.addError('You’ve already added this condition to your claim');
  }
};

export const validateCondition = (err, fieldData = '', formData = {}) => {
  validateLength(err, fieldData);
  validateNotMissing(err, fieldData);
  validateNotDuplicate(err, fieldData, formData, arrayBuilderOptions.arrayPath);
};

export const hasSideOfBody = (formData, index) => {
  const condition =
    formData?.[arrayBuilderOptions.arrayPath][index]?.newCondition;

  const conditionObject = conditionObjects.find(
    conditionObj => conditionObj.option === condition,
  );

  return conditionObject ? conditionObject.sideOfBody : false;
};

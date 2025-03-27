import { format } from 'date-fns';
import {
  getArrayIndexFromPathName,
  getArrayUrlSearchParams,
} from 'platform/forms-system/src/js/patterns/array-builder/helpers';

import { conditionObjects } from '../../content/conditionOptions';

const arrayPath = 'conditions';

export const isActiveDemo = (formData, currentDemo) =>
  formData?.demo === currentDemo;

export const isEdit = () => {
  const search = getArrayUrlSearchParams();
  return search.get('edit');
};

export const createDefaultAndEditTitles = (defaultTitle, editTitle) => {
  if (isEdit()) {
    return editTitle;
  }
  return defaultTitle;
};

export const isNewCondition = (formData, index) => {
  if (formData?.[arrayPath]) {
    const conditionType = formData[arrayPath]?.[index]?.['view:conditionType'];

    return !conditionType || conditionType === 'NEW';
  }

  return (
    !formData?.['view:conditionType'] ||
    formData?.['view:conditionType'] === 'NEW'
  );
};

export const isRatedDisability = (formData, index) => {
  if (formData?.[arrayPath]) {
    const conditionType = formData[arrayPath]?.[index]?.['view:conditionType'];

    return conditionType === 'RATED';
  }

  return formData?.['view:conditionType'] === 'RATED';
};

const getSelectedRatedDisabilities = fullData => {
  const currentIndex = getArrayIndexFromPathName();

  return fullData?.[arrayPath]?.reduce((acc, item, index) => {
    if (index !== currentIndex && isRatedDisability(item)) {
      acc.push(item?.ratedDisability);
    }
    return acc;
  }, []);
};

export const createNonSelectedRatedDisabilities = fullData => {
  const selectedRatedDisabilities = getSelectedRatedDisabilities(fullData);

  return (
    fullData?.ratedDisabilities?.reduce((acc, disability) => {
      if (!selectedRatedDisabilities?.includes(disability.name)) {
        acc[disability.name] = disability.name;
      }
      return acc;
    }, {}) || {}
  );
};

export const hasRatedDisabilities = fullData => {
  if (fullData?.ratedDisabilities?.length === 0) {
    return false;
  }

  return Object.keys(createNonSelectedRatedDisabilities(fullData)).length > 0;
};

export const hasRatedDisabilitiesOrIsRatedDisability = (fullData, index) =>
  hasRatedDisabilities(fullData) || isRatedDisability(fullData, index);

export const hasRatedDisabilitiesAndIsRatedDisability = (fullData, index) =>
  hasRatedDisabilities(fullData) && isRatedDisability(fullData, index);

// Different than lodash _capitalize because does not make rest of string lowercase which would break acronyms
const capitalizeFirstLetter = string => {
  return string?.charAt(0).toUpperCase() + string?.slice(1);
};

export const createNewConditionName = (item, capFirstLetter = false) => {
  const newCondition = capFirstLetter
    ? capitalizeFirstLetter(item?.newCondition)
    : item?.newCondition || 'condition';

  if (item?.sideOfBody) {
    return `${newCondition}, ${item?.sideOfBody.toLowerCase()}`;
  }

  return newCondition;
};

const getItemName = item => {
  if (isNewCondition(item)) {
    return createNewConditionName(item, true);
  }

  return item?.ratedDisability;
};

const createCauseDescriptions = item => {
  const cause = item?.cause;

  const causeDescriptions = {
    NEW: 'Caused by an injury or exposure during my service.',
    SECONDARY: `Caused by ${item?.causedByCondition ||
      'an unspecified condition'}.`,
    WORSENED:
      'Existed before I served in the military, but got worse because of my military service.',
    VA:
      'Caused by an injury or event that happened when I was receiving VA care.',
  };

  return causeDescriptions[cause];
};

const causeFollowUpChecks = {
  NEW: item => !item?.primaryDescription,
  SECONDARY: item =>
    !item?.causedByCondition || !item?.causedByConditionDescription,
  WORSENED: item => !item?.worsenedDescription || !item?.worsenedEffects,
  VA: item => !item?.vaMistreatmentDescription || !item?.vaMistreatmentLocation,
};

const isItemIncomplete = item => {
  if (isNewCondition(item)) {
    return (
      !item?.newCondition ||
      !item?.cause ||
      causeFollowUpChecks[item.cause](item)
    );
  }

  return !item?.ratedDisability;
};

const formatYearMonth = dateString => {
  if (!dateString) {
    return '';
  }

  const [year, month] = dateString.split('-').map(Number);
  return format(new Date(year, month - 1), 'MMMM yyyy');
};

const createRatedDisabilityCardDescription = item => {
  const baseDescription = 'Claim for increase';

  const dateDescription = item?.conditionDate
    ? `; worsened ${formatYearMonth(item.conditionDate)}`
    : '';

  return `${baseDescription}${dateDescription}`;
};

const createNewConditionCardDescription = item => {
  const baseDescription = 'New condition';

  const dateDescription = item?.conditionDate
    ? `; started ${formatYearMonth(item.conditionDate)}`
    : '';

  const causeDescription = `; ${createCauseDescriptions(item)}`;

  return `${baseDescription}${dateDescription}${causeDescription}`;
};

const cardDescription = item => {
  if (isNewCondition(item)) {
    return createNewConditionCardDescription(item);
  }

  return createRatedDisabilityCardDescription(item);
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
    getItemName,
    cardDescription,
  },
};

export const hasSideOfBody = (formData, index) => {
  const condition =
    formData?.[arrayBuilderOptions.arrayPath][index]?.newCondition;

  const conditionObject = conditionObjects.find(
    conditionObj => conditionObj.option === condition,
  );

  return conditionObject ? conditionObject.sideOfBody : false;
};

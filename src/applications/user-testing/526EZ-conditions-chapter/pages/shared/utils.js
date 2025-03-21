import { format } from 'date-fns';
import {
  getArrayIndexFromPathName,
  getArrayUrlSearchParams,
} from 'platform/forms-system/src/js/patterns/array-builder/helpers';

import { RATED_OR_NEW_RADIOS } from '../../constants';
import { conditionObjects } from '../../content/conditionOptions';

const arrayPath = 'demos';

export const isActiveDemo = (formData, currentDemo) =>
  formData?.demo === currentDemo;

export const createDefaultAndEditTitles = (defaultTitle, editTitle) => {
  const search = getArrayUrlSearchParams();
  const isEdit = search.get('edit');

  if (isEdit) {
    return editTitle;
  }
  return defaultTitle;
};

const getSelectedRatedDisabilities = fullData => {
  const currentIndex = getArrayIndexFromPathName();

  return fullData?.[arrayPath]?.reduce((acc, item, index) => {
    if (index !== currentIndex) {
      acc.push(item?.ratedDisability);
    }
    return acc;
  }, []);
};

export const createNonSelectedRatedDisabilities = fullData => {
  const selectedRatedDisabilities = getSelectedRatedDisabilities(fullData);

  return fullData?.ratedDisabilities?.reduce((acc, disability) => {
    if (!selectedRatedDisabilities?.includes(disability.name)) {
      acc[disability.name] = disability.name;
    }
    return acc;
  }, {});
};

export const hasRemainingRatedDisabilities = fullData => {
  if (fullData?.ratedDisabilities?.length === 0) {
    return false;
  }

  return Object.keys(createNonSelectedRatedDisabilities(fullData)).length > 0;
};

const checkNewConditionRadio = ratedDisability =>
  !ratedDisability ||
  ratedDisability === 'Add a new condition' ||
  ratedDisability === 'Edit new condition';

const isNewConditionRatedOrNewRadios = (formData, index) => {
  if (formData?.[arrayPath]) {
    const ratedOrNew = formData?.[arrayPath]?.[index]?.ratedOrNew;

    return ratedOrNew === 'NEW' || !hasRemainingRatedDisabilities(formData);
  }

  return (
    formData?.ratedOrNew === 'NEW' || !hasRemainingRatedDisabilities(formData)
  );
};

const isNewConditionRatedOrNewNextPage = (formData, index) => {
  if (formData?.[arrayPath]) {
    const ratedDisability = formData?.[arrayPath]?.[index]?.ratedDisability;

    return checkNewConditionRadio(ratedDisability);
  }

  return checkNewConditionRadio(formData?.ratedDisability);
};

export const isNewCondition = (formData, index) => {
  if (isActiveDemo(formData, RATED_OR_NEW_RADIOS.name)) {
    return isNewConditionRatedOrNewRadios(formData, index);
  }

  return isNewConditionRatedOrNewNextPage(formData, index);
};

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

const createCauseDescriptions = item => ({
  NEW: 'Caused by an injury or exposure during my service.',
  SECONDARY: `Caused by ${item?.causedByCondition}.`,
  WORSENED:
    'Existed before I served in the military, but got worse because of my military service.',
  VA:
    'Caused by an injury or event that happened when I was receiving VA care.',
});

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
  let ratedDisabilityDescription = 'Claim for increase';

  if (item?.ratedDisabilityDate) {
    ratedDisabilityDescription += `; worsened ${formatYearMonth(
      item?.ratedDisabilityDate,
    )}`;
  }

  return ratedDisabilityDescription;
};

const createNewConditionCardDescription = item => {
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

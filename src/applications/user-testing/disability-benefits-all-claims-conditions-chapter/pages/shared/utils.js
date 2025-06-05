import {
  getArrayIndexFromPathName,
  getArrayUrlSearchParams,
} from 'platform/forms-system/src/js/patterns/array-builder/helpers';

import {
  ARRAY_PATH,
  CONDITION_TYPE_RADIO,
  NEW_CONDITION_OPTION,
} from '../../constants';
import { conditionObjects } from '../../content/conditionOptions';
import {
  NewConditionCardDescription,
  RatedDisabilityCardDescription,
} from '../../content/conditions';

// Just for user testing demo functionality
export const isActiveDemo = (formData, currentDemo) =>
  formData?.demo === currentDemo;

export const isEditFromContext = context => context?.edit;

const isEditFromUrl = () => {
  const search = getArrayUrlSearchParams();
  const hasEdit = search.get('edit');
  return !!hasEdit;
};

export const createAddAndEditTitles = (addTitle, editTitle) =>
  isEditFromUrl() ? editTitle : addTitle;

export const createRatedDisabilityDescriptions = fullData => {
  return fullData.ratedDisabilities.reduce((acc, disability) => {
    let description = `Current rating: ${disability.ratingPercentage}%`;

    if (disability.ratingPercentage === disability.maximumRatingPercentage) {
      description += ` (You're already at the maximum for this rated disability.)`;
    }

    acc[disability.name] = description;

    return acc;
  }, {});
};

// Just for ConditionTypeRadio demo
const isNewConditionForConditionTypeRadio = (formData, index) => {
  if (formData?.[ARRAY_PATH]) {
    const conditionType = formData[ARRAY_PATH]?.[index]?.['view:conditionType'];

    return !conditionType || conditionType === 'NEW';
  }

  return (
    !formData?.['view:conditionType'] ||
    formData?.['view:conditionType'] === 'NEW'
  );
};

// Just for ConditionTypeRadio demo
const isRatedDisabilityForConditionTypeRadio = (formData, index) => {
  if (formData?.[ARRAY_PATH]) {
    const conditionType = formData[ARRAY_PATH]?.[index]?.['view:conditionType'];

    return conditionType === 'RATED';
  }

  return formData?.['view:conditionType'] === 'RATED';
};

// Just for RatedOrNewNextPage demo
const isNewConditionOption = ratedDisability =>
  ratedDisability === NEW_CONDITION_OPTION;

// Just for RatedOrNewNextPage demo
const isNewConditionForRatedOrNewNextPage = (formData, index) => {
  if (formData?.[ARRAY_PATH]) {
    const ratedDisability = formData?.[ARRAY_PATH]?.[index]?.ratedDisability;

    return !ratedDisability || isNewConditionOption(ratedDisability);
  }

  return (
    !formData?.ratedDisability ||
    isNewConditionOption(formData?.ratedDisability)
  );
};

// Just for RatedOrNewNextPage demo
const isRatedDisabilityForRatedOrNewNextPage = (formData, index) => {
  if (formData?.[ARRAY_PATH]) {
    const ratedDisability = formData?.[ARRAY_PATH]?.[index]?.ratedDisability;

    return ratedDisability && !isNewConditionOption(ratedDisability);
  }

  return (
    formData?.ratedDisability &&
    !isNewConditionOption(formData?.ratedDisability)
  );
};

export const isNewCondition = (formData, index) => {
  if (isActiveDemo(formData, CONDITION_TYPE_RADIO.name)) {
    return isNewConditionForConditionTypeRadio(formData, index);
  }

  return isNewConditionForRatedOrNewNextPage(formData, index);
};

export const isRatedDisability = (formData, index) => {
  if (isActiveDemo(formData, CONDITION_TYPE_RADIO.name)) {
    return isRatedDisabilityForConditionTypeRadio(formData, index);
  }

  return isRatedDisabilityForRatedOrNewNextPage(formData, index);
};

const getSelectedRatedDisabilities = fullData => {
  const currentIndex = getArrayIndexFromPathName();

  return fullData?.[ARRAY_PATH]?.reduce((acc, item, index) => {
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

// Different than lodash _capitalize because does not make rest of string lowercase which would break acronyms
const capitalizeFirstLetter = string =>
  string?.charAt(0).toUpperCase() + string?.slice(1);

export const createNewConditionName = (item, capFirstLetter = false) => {
  const newCondition = capFirstLetter
    ? capitalizeFirstLetter(item?.newCondition)
    : item?.newCondition || 'new condition';

  if (item?.sideOfBody) {
    return `${newCondition}, ${item?.sideOfBody.toLowerCase()}`;
  }

  return newCondition;
};

const getItemName = item =>
  isNewCondition(item)
    ? createNewConditionName(item, true)
    : item?.ratedDisability;

const causeFollowUpChecks = {
  NEW: item => !item?.primaryDescription,
  SECONDARY: item =>
    !item?.causedByCondition ||
    !Object.keys(item?.causedByCondition).length || // Check only needed for the secondary enhanced flow
    !item?.causedByConditionDescription,
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

const cardDescription = (item, _index, formData) =>
  isNewCondition(item)
    ? NewConditionCardDescription(item, formData)
    : RatedDisabilityCardDescription(item, formData);

/** @type {ArrayBuilderOptions} */
export const arrayBuilderOptions = {
  arrayPath: ARRAY_PATH,
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
  const condition = formData?.[ARRAY_PATH][index]?.newCondition;

  const conditionObject = conditionObjects.find(
    conditionObj => conditionObj.option === condition,
  );

  return conditionObject ? conditionObject.sideOfBody : false;
};

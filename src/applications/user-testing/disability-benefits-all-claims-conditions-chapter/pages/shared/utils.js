import { format } from 'date-fns';
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

export const isActiveDemo = (formData, currentDemo) =>
  formData?.demo === currentDemo;

export const isEdit = () => {
  const search = getArrayUrlSearchParams();
  const hasEdit = search.get('edit');
  return !!hasEdit;
};

export const createDefaultAndEditTitles = (defaultTitle, editTitle) => {
  if (isEdit()) {
    return editTitle;
  }
  return defaultTitle;
};

export const createRatedDisabilityDescriptions = fullData => {
  return fullData.ratedDisabilities.reduce((acc, disability) => {
    let text = `Current rating: ${disability.ratingPercentage}%`;

    if (disability.ratingPercentage === disability.maximumRatingPercentage) {
      text += ` (You're already at the maximum for this rated disability.)`;
    }

    acc[disability.name] = text;

    return acc;
  }, {});
};

const isNewConditionConditionTypeRadio = (formData, index) => {
  if (formData?.[ARRAY_PATH]) {
    const conditionType = formData[ARRAY_PATH]?.[index]?.['view:conditionType'];

    return !conditionType || conditionType === 'NEW';
  }

  return (
    !formData?.['view:conditionType'] ||
    formData?.['view:conditionType'] === 'NEW'
  );
};

const isRatedDisabilityConditionTypeRadio = (formData, index) => {
  if (formData?.[ARRAY_PATH]) {
    const conditionType = formData[ARRAY_PATH]?.[index]?.['view:conditionType'];

    return conditionType === 'RATED';
  }

  return formData?.['view:conditionType'] === 'RATED';
};

const isNewConditionOption = ratedDisability =>
  ratedDisability === NEW_CONDITION_OPTION;

const isNewConditionRatedOrNewNextPage = (formData, index) => {
  if (formData?.[ARRAY_PATH]) {
    const ratedDisability = formData?.[ARRAY_PATH]?.[index]?.ratedDisability;

    return !ratedDisability || isNewConditionOption(ratedDisability);
  }

  return (
    !formData?.ratedDisability ||
    isNewConditionOption(formData?.ratedDisability)
  );
};

const isRatedDisabilityRatedOrNewNextPage = (formData, index) => {
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
    return isNewConditionConditionTypeRadio(formData, index);
  }

  return isNewConditionRatedOrNewNextPage(formData, index);
};

export const isRatedDisability = (formData, index) => {
  if (isActiveDemo(formData, CONDITION_TYPE_RADIO.name)) {
    return isRatedDisabilityConditionTypeRadio(formData, index);
  }

  return isRatedDisabilityRatedOrNewNextPage(formData, index);
};

export const clearSideOfBody = (formData, index, setFormData) => {
  setFormData({
    ...formData,
    [ARRAY_PATH]: formData[ARRAY_PATH].map(
      (item, i) => (i === index ? { ...item, sideOfBody: undefined } : item),
    ),
  });
};

export const clearNewConditionData = (formData, index, setFormData) => {
  setFormData({
    ...formData,
    [ARRAY_PATH]: formData[ARRAY_PATH].map(
      (item, i) =>
        i === index
          ? {
              ...item,
              newCondition: undefined,
              cause: undefined,
              primaryDescription: undefined,
              causedByCondition: undefined,
              causedByConditionDescription: undefined,
              vaMistreatmentDescription: undefined,
              vaMistreatmentLocation: undefined,
              worsenedDescription: undefined,
              worsenedEffects: undefined,
            }
          : item,
    ),
  });
};

export const clearRatedDisabilityData = (formData, index, setFormData) => {
  setFormData({
    ...formData,
    [ARRAY_PATH]: formData[ARRAY_PATH].map(
      (item, i) =>
        i === index ? { ...item, ratedDisability: undefined } : item,
    ),
  });
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

export const hasRatedDisabilitiesOrIsRatedDisability = (fullData, index) =>
  hasRatedDisabilities(fullData) || isRatedDisability(fullData, index);

export const hasRatedDisabilitiesAndIsRatedDisability = (fullData, index) =>
  hasRatedDisabilities(fullData) && isRatedDisability(fullData, index);

// Different than lodash _capitalize because does not make rest of string lowercase which would break acronyms
const capitalizeFirstLetter = string =>
  string?.charAt(0).toUpperCase() + string?.slice(1);

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

const createConditionsString = item => {
  const conditions = Object.keys(item?.causedByCondition || {}).filter(
    key => item.causedByCondition[key],
  );

  let conditionsString = '';

  if (conditions.length === 1) {
    const [condition] = conditions;
    conditionsString = condition;
  } else if (conditions.length === 2) {
    conditionsString = conditions.join(' and ');
  } else if (conditions.length > 2) {
    conditionsString = `${conditions.slice(0, -1).join(', ')}, and ${
      conditions[conditions.length - 1]
    }`;
  }

  return conditionsString;
};

const createCauseDescriptions = item => {
  const cause = item?.cause;

  const causeDescriptions = {
    NEW: 'Caused by an injury or exposure during my service.',
    SECONDARY: `Caused by ${createConditionsString(item) ||
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

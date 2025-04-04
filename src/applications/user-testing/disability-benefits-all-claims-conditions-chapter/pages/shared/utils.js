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
import {
  NewConditionCardDescription,
  RatedDisabilityCardDescription,
} from '../../content/conditions';

export const isActiveDemo = (formData, currentDemo) =>
  formData?.demo === currentDemo;

export const isEdit = () => {
  const search = getArrayUrlSearchParams();
  const hasEdit = search.get('edit');
  return !!hasEdit;
};

export const createAddAndEditTitles = (addTitle, editTitle) => {
  if (isEdit()) {
    return editTitle;
  }
  return addTitle;
};

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

const isRatedDisabilityForConditionTypeRadio = (formData, index) => {
  if (formData?.[ARRAY_PATH]) {
    const conditionType = formData[ARRAY_PATH]?.[index]?.['view:conditionType'];

    return conditionType === 'RATED';
  }

  return formData?.['view:conditionType'] === 'RATED';
};

const isNewConditionOption = ratedDisability =>
  ratedDisability === NEW_CONDITION_OPTION;

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

const formatDateString = dateString => {
  if (!dateString) {
    return '';
  }

  const [year, month, day] = dateString.split('-').map(Number);
  if (day) {
    return format(new Date(year, month - 1, day), 'MMMM d, yyyy');
  }
  return format(new Date(year, month - 1), 'MMMM yyyy');
};

const cardDescription = (item, _index, formData) => {
  const date = formatDateString(item?.conditionDate);

  if (isNewCondition(item)) {
    return NewConditionCardDescription(item, date);
  }

  return RatedDisabilityCardDescription(item, formData, date);
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

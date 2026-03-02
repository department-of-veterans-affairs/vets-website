import { useEffect } from 'react';
import {
  getArrayIndexFromPathName,
  getArrayUrlSearchParams,
} from 'platform/forms-system/src/js/patterns/array-builder/helpers';
import { waitForShadowRoot } from 'platform/utilities/ui/webComponents';

import { ARRAY_PATH, NEW_CONDITION_OPTION } from '../../constants';
import { conditionObjects } from '../../content/conditionOptions';
import {
  NewConditionCardDescription,
  RatedDisabilityCardDescription,
} from '../../content/conditions';

export const isEditFromContext = context => context?.edit;

const isEditFromUrl = () => Boolean(getArrayUrlSearchParams().get('edit'));

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

const isNewConditionOption = ratedDisability =>
  ratedDisability === NEW_CONDITION_OPTION;

export const isNewCondition = (formData, index) => {
  if (formData?.[ARRAY_PATH]) {
    const ratedDisability = formData?.[ARRAY_PATH]?.[index]?.ratedDisability;
    return !ratedDisability || isNewConditionOption(ratedDisability);
  }

  return (
    !formData?.ratedDisability ||
    isNewConditionOption(formData?.ratedDisability)
  );
};

export const isRatedDisability = (formData, index) => {
  if (formData?.[ARRAY_PATH]) {
    const ratedDisability = formData?.[ARRAY_PATH]?.[index]?.ratedDisability;
    return ratedDisability && !isNewConditionOption(ratedDisability);
  }

  return (
    formData?.ratedDisability &&
    !isNewConditionOption(formData?.ratedDisability)
  );
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

export const createNewConditionName = (item = {}, capFirstLetter = false) => {
  const newConditionName = item.newCondition;

  // Check for a non-empty string here instead of each time
  // arrayBuilderItemSubsequentPageTitleUI is called in different files
  const checkNewConditionName =
    typeof newConditionName === 'string' && newConditionName.trim()
      ? newConditionName.trim()
      : 'condition';

  const newCondition = capFirstLetter
    ? capitalizeFirstLetter(checkNewConditionName)
    : checkNewConditionName;

  if (item?.sideOfBody) {
    return `${newCondition}, ${item.sideOfBody.toLowerCase()}`;
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

export const isItemIncomplete = item => {
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
    alertItemUpdated: ({ itemData, nounSingular }) => {
      const name = getItemName(itemData);
      return name
        ? `"${name}’s" information has been updated`
        : `"${nounSingular}" information has been updated`;
    },
    cancelAddTitle: ({ itemData, nounSingular }) => {
      const name = getItemName(itemData);
      return name
        ? `Cancel adding "${name}"?`
        : `Cancel adding this "${nounSingular}"?`;
    },
    cancelEditTitle: ({ itemData, nounSingular }) => {
      const name = getItemName(itemData);
      return name
        ? `Cancel editing "${name}"?`
        : `Cancel editing this "${nounSingular}"?`;
    },
    deleteTitle: ({ itemData, nounSingular }) => {
      const name = getItemName(itemData);
      return name
        ? `Delete "${name}’s" information?`
        : `Delete this "${nounSingular}"?`;
    },
  },
};

export const hasSideOfBody = (formData, index) => {
  const condition = formData?.[ARRAY_PATH][index]?.newCondition;
  const conditionObject = conditionObjects.find(
    conditionObj => conditionObj.option === condition,
  );

  return conditionObject ? conditionObject.sideOfBody : false;
};

// Ensure every continue click blurs inputs,
// which triggers internal VA form field update logic
export const ForceFieldBlur = () => {
  useEffect(() => {
    const handleClick = () => {
      document.activeElement?.blur?.();
    };

    const buttons = document.querySelectorAll('button[type="submit"]');
    buttons.forEach(btn => btn.addEventListener('click', handleClick));

    return () => {
      buttons.forEach(btn => btn.removeEventListener('click', handleClick));
    };
  }, []);

  return null;
};

// VA platform runs validation based on formData.dateString,
// which is populated after all field blur events
const getCurrentYear = () => new Date(Date.now()).getFullYear();

export const validateApproximateDate = (errors, dateString) => {
  if (!dateString) return;

  const [year, month, day] = dateString.split('-');
  const isYearValid = year && year !== 'XXXX';
  const isMonthValid = month && month !== 'XX';
  const isDayValid = day && day !== 'XX';

  const isValid =
    (isYearValid && !isMonthValid && !isDayValid) || // Year only
    (isYearValid && isMonthValid && !isDayValid) || // Year + Month
    (isYearValid && isMonthValid && isDayValid); // Full date

  if (!isValid) {
    errors.addError(
      'Enter a year only (e.g., 1988), a month and year (e.g., June 1988), or a full date (e.g., June 1 1988)',
    );
    return;
  }

  const y = Number(year);
  const minYear = 1900;
  const maxYear = getCurrentYear();
  if (!Number.isInteger(y) || y < minYear || y > maxYear) {
    errors.addError(`Please enter a year between ${minYear} and ${maxYear}`);
  }
};

// Inject a CSS rule into the shadow DOM of any matching web-component(s)
// found on the current page (whose URL matches one of the `urlArray` items).
// Usage:
//   addStyleToShadowDomOnPages(
//     [''],                 // URLs to match – '' means “this page”
//     ['va-memorable-date'],// components to patch
//     '#dateHint{display:none}'
//   );
// This is to hide the second For example date in the UI on pages
// where a date can be entered
export const addStyleToShadowDomOnPages = async (
  urlArray,
  targetElements,
  style,
) => {
  if (urlArray.some(u => window.location.href.includes(u)))
    targetElements.forEach(selector => {
      document.querySelectorAll(selector).forEach(async component => {
        try {
          const el = await waitForShadowRoot(component);
          if (el?.shadowRoot) {
            const sheet = new CSSStyleSheet();
            sheet.replaceSync(style);
            el.shadowRoot.adoptedStyleSheets.push(sheet);
          }
        } catch (_) {
          // Fail silently (styles just won't be applied)
        }
      });
    });
};

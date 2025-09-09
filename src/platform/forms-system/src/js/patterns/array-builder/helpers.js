import { useMemo } from 'react';
import get from 'platform/utilities/data/get';
import set from 'platform/utilities/data/set';
import { getUrlPathIndex } from 'platform/forms-system/src/js/helpers';
import { isMinimalHeaderPath } from 'platform/forms-system/src/js/patterns/minimal-header';
import { focusByOrder, focusElement } from 'platform/utilities/ui/focus';
import { scrollTo, scrollToTop } from 'platform/utilities/scroll';
import navigationState from 'platform/forms-system/src/js/utilities/navigation/navigationState';
import environment from 'platform/utilities/environment';
import {
  dispatchIncompleteItemError,
  dispatchDuplicateItemError,
} from './ArrayBuilderEvents';
import { DEFAULT_ARRAY_BUILDER_TEXT } from './arrayBuilderText';

// Previously set to '_metadata', but upon saving, the Ruby gem 'olivebranch'
// converts this to 'Metadata', then upon returning to the form, this key is
// converted to 'metadata'. To avoid confusion, we're using 'metadata'; and this
// may need to be filtered out of submission data.
export const META_DATA_KEY = 'metadata';

/**
 * @param {string} [search] e.g. `?add=true`
 * @returns {URLSearchParams}
 */
export function getArrayUrlSearchParams(search = window?.location?.search) {
  return new URLSearchParams(search);
}

/**
 * Initializes the getText function for the ArrayBuilder
 */
export function initGetText({
  textOverrides = {},
  getItemName,
  nounPlural,
  nounSingular,
} = {}) {
  if (!getItemName || typeof getItemName !== 'function') {
    throw new Error('getItemName is required for initGetText');
  }
  if (!nounPlural) {
    throw new Error('nounPlural is required for initGetText');
  }
  if (!nounSingular) {
    throw new Error('nounSingular is required for initGetText');
  }
  const getTextValues = {
    ...DEFAULT_ARRAY_BUILDER_TEXT,
    getItemName,
    ...textOverrides,
  };

  const searchParams = getArrayUrlSearchParams();
  const getTextProps = {
    getItemName,
    nounPlural,
    nounSingular,
    isEdit: !!searchParams.get('edit'),
    isAdd: !!searchParams.get('add'),
  };

  /**
   * @param {ArrayBuilderTextKey} key
   * @param {any} itemData
   * @param {any} [formData]
   * @param {number} [index]
   * @returns {string}
   */
  return (key, itemData, formData, index) => {
    const keyVal = getTextValues?.[key];

    if (key === 'getItemName') {
      return typeof keyVal === 'function'
        ? keyVal(itemData, index, formData)
        : keyVal;
    }

    if (key === 'cardDescription') {
      let text = keyVal;

      if (typeof keyVal === 'function') {
        // a try/catch is already done for getItemName in arrayBuilder.jsx,
        // so only handle cardDescription here, possibly extend this to
        // other text functions in the future
        try {
          text = keyVal(itemData, index, formData);
        } catch (e) {
          text = '';
          if (!environment.isProduction()) {
            // eslint-disable-next-line no-console
            console.error(
              `Error in array builder option "cardDescription":`,
              e,
            );
          }
        }
      }
      return text;
    }

    return typeof keyVal === 'function'
      ? getTextValues?.[key]({
          ...getTextProps,
          itemData,
          formData,
          index,
        })
      : keyVal;
  };
}

/**
 * introRoute is optional, if not provided, it will default to summaryRoute
 *
 * Usage:
 * ```
 * onNavBack: onNavBackRemoveAddingItem({
 *  arrayPath: 'employers',
 *  summaryRoute: '/array-multiple-page-builder-summary',
 *  introRoute: '/array-multiple-page-builder',
 * }),
 * ```
 * @param {{
 *  arrayPath: string;
 *  summaryRoute: string;
 *  introRoute?: string;
 * }} props
 */
export function onNavBackRemoveAddingItem({
  arrayPath,
  summaryRoute,
  introRoute,
  reviewRoute,
}) {
  return function onNavBack({ goPath, formData, setFormData, urlParams }) {
    const arrayData = get(arrayPath, formData);
    let newArrayData = arrayData;
    if ('add' in urlParams && arrayData?.length) {
      // remove current item
      newArrayData = arrayData.slice(0, -1);
      const newData = set(arrayPath, newArrayData, formData);
      setFormData(newData);
    }

    let path = introRoute && !newArrayData?.length ? introRoute : summaryRoute;
    if (urlParams?.review) {
      path = reviewRoute;
    }
    goPath(path);
  };
}

/**
 * Usage:
 * ```
 * uiSchema: ...
 * schema: ...
 * onNavForward: onNavForwardKeepUrlParams,
 * ```
 */
export function onNavForwardKeepUrlParams({ goNextPath, urlParams }) {
  goNextPath(urlParams);
}

/**
 * Usage:
 * ```
 * uiSchema: ...
 * schema: ...
 * onNavBack: onNavBackKeepUrlParams,
 * ```
 */
export function onNavBackKeepUrlParams({ goPreviousPath, urlParams }) {
  goPreviousPath(urlParams);
}

/**
 * Creates a path with a `add` query param
 * @param {Object} props
 * @param {string} props.path e.g. `/path-item/:index`
 * @param {boolean} [props.isReview] if coming from the review page
 * @param {boolean} [props.removedAllWarn] if all items were removed
 * @param {string | number} props.index
 * @returns {string} e.g. `/path-item/0?add=true`
 */
export function createArrayBuilderItemAddPath({
  path,
  index,
  isReview,
  removedAllWarn,
}) {
  return `${path.replace(':index', index)}?add=true${
    isReview ? '&review=true' : ''
  }${removedAllWarn ? '&removedAllWarn=true' : ''}`;
}

/**
 * Creates a path with a `edit` query param
 * @param {Object} props
 * @param {string} props.path e.g. `/path-item/:index`
 * @param {string | number} props.index
 * @param {boolean} [props.isReview] if coming from the review page
 * @returns {string} e.g. `/path-item/0?edit=true`
 */
export function createArrayBuilderItemEditPath({ path, index, isReview }) {
  return `${path.replace(':index', index)}?edit=true${
    isReview ? '&review=true' : ''
  }`;
}

export function slugifyText(nounSingular) {
  return nounSingular.toLowerCase().replace(/ /g, '-');
}

/**
 * Creates a path with a `updated` query param
 * @param {Object} props
 * @param {string} props.path e.g. `/path-summary`
 * @param {string} props.nounSingular e.g. `employer`
 * @param {string | number} props.index
 * @returns {string} e.g. `/path-summary?updated=employer-0`
 */
export function createArrayBuilderUpdatedPath({
  basePath,
  nounSingular,
  index,
}) {
  return `${basePath}?updated=${slugifyText(nounSingular)}-${index}`;
}

export function isDeepEmpty(obj) {
  return obj
    ? Object.values(obj).every(
        value =>
          (typeof value === 'object' && value !== null && isDeepEmpty(value)) ||
          value === null ||
          value === undefined ||
          value === '',
      )
    : true;
}

// Used as a helper so that we can stub this for tests
export function getArrayIndexFromPathName(
  pathname = window?.location?.pathname,
) {
  return getUrlPathIndex(pathname);
}

/**
 * Gets the nounSingular and index from the URL `updated=` path
 * @param {string} [search] e.g. `?add=true`
 * @returns {{
 *   nounSingular: string | null,
 *   index: number | null,
 * }}
 */
export function getUpdatedItemFromPath(search = window?.location?.search) {
  const urlParams = getArrayUrlSearchParams(search);
  const updatedValue = urlParams.get('updated');

  const updatedItem = {
    nounSingular: null,
    index: null,
  };

  try {
    const parts = updatedValue?.split('-');
    if (parts?.length) {
      const index = Number(parts.pop());
      updatedItem.index = index;
      updatedItem.nounSingular = parts.join(' ');
    }
  } catch (e) {
    // do nothing
  }
  return updatedItem;
}

/**
 * @param {{
 *  arrayPath: string,
 *  nounSingular: string,
 *  nounPlural: string,
 *  maxItems: boolean,
 * }} options
 */
export const maxItemsHint = ({
  arrayData,
  nounSingular,
  nounPlural,
  maxItems,
}) => {
  let hint = '';
  const len = arrayData?.length;

  if (maxItems) {
    if (!len || maxItems === 1 || len >= maxItems) {
      hint = `You can add up to ${maxItems}.`;
    } else if (len && maxItems - len === 1) {
      hint = `You can add 1 more ${nounSingular}.`;
    } else if (len && maxItems - len > 1) {
      hint = `You can add ${maxItems - len} more ${nounPlural}.`;
    }
  }

  return hint;
};

export const defaultSummaryPageScrollAndFocusTarget = () => {
  const minimalHeader = isMinimalHeaderPath();
  const headerLevel = minimalHeader ? '1' : '3';
  const radioHeader = document.querySelector(
    `va-radio[label-header-level="${headerLevel}"]`,
  );

  if (minimalHeader) {
    scrollTo('header-minimal');
  } else {
    scrollToTop('topScrollElement');
  }

  if (radioHeader) {
    focusElement(`h${headerLevel}`, null, radioHeader);
  } else {
    focusByOrder([`form h${headerLevel}`, 'va-segmented-progress-bar']);
  }
};

export const defaultItemPageScrollAndFocusTarget = () => {
  const minimalHeader = isMinimalHeaderPath();
  const headerLevel = minimalHeader ? 'h1' : 'h3';

  if (minimalHeader) {
    scrollTo('header-minimal');
  } else {
    scrollToTop('topScrollElement');
  }

  // If we have something with `label-header-level`, then that is likely
  // the title of the page, so we should focus on that.
  const radioHeader = document.querySelector('va-radio[label-header-level]');
  const checkboxGroupHeader = document.querySelector(
    'va-checkbox-group[label-header-level]',
  );

  if (radioHeader) {
    focusElement(headerLevel, null, radioHeader);
  } else if (checkboxGroupHeader) {
    focusElement(headerLevel, null, checkboxGroupHeader);
  } else {
    focusByOrder([`form ${headerLevel}`, 'va-segmented-progress-bar']);
  }
};

export const replaceItemInFormData = ({
  formData,
  newItem,
  arrayPath,
  index,
}) => {
  let newFormData = formData;

  if (formData?.[arrayPath]?.[index]) {
    newFormData = {
      ...formData,
      [arrayPath]: formData[arrayPath].map((item, i) => {
        return i === index ? newItem : item;
      }),
    };
  }

  return newFormData;
};

export const arrayBuilderContextObject = ({
  add = false,
  edit = false,
  review = false,
}) => {
  return { add, edit, review };
};

export const arrayBuilderDependsContextWrapper = contextObject => {
  let add = false;
  let edit = false;
  let review = false;

  if (contextObject) {
    add = contextObject.add;
    edit = contextObject.edit;
    review = contextObject.review;
  } else {
    const urlParams = getArrayUrlSearchParams();
    add = urlParams.get('add') === 'true';
    edit = urlParams.get('edit') === 'true';
    review = urlParams.get('review') === 'true';
  }

  return { add, edit, review };
};

/**
 *
 * @param {Array} arrayData
 * @param {Function} isItemIncomplete
 * @returns {number|null}
 */
const getFirstInvalidArrayDataIndex = (arrayData, isItemIncomplete) => {
  if (!arrayData || !arrayData.length) {
    return null;
  }

  for (let i = 0; i < arrayData.length; i++) {
    const item = arrayData[i];
    if (isItemIncomplete(item)) {
      return i;
    }
  }

  return null;
};

/**
 *
 * @param {Object} props
 * @param {Array} props.arrayData - The array data to validate
 * @param {Function} props.isItemIncomplete - Function to check if an item is incomplete
 * @param {string} [props.arrayPath] - The array path (e.g. 'treatmentRecords')
 * @param {Function} [props.addError] - Optional function to add an error
 * @returns {boolean} - Returns an object with the index of the incomplete item or null if all items are complete
 */
export const validateIncompleteItems = ({
  arrayData,
  isItemIncomplete,
  nounSingular,
  errors,
  arrayPath,
}) => {
  const invalidIndex = getFirstInvalidArrayDataIndex(
    arrayData,
    isItemIncomplete,
  );
  // invalidIndex = null, 0, 1, 2, 3...
  const isValid = invalidIndex === null;

  if (!isValid && navigationState.getNavigationEventStatus()) {
    // The user clicked continue
    dispatchIncompleteItemError({
      index: invalidIndex,
      arrayPath,
    });

    // If provided, this is what will block continuing in
    // a normal uiSchema/schema flow, visible or not.
    if (errors && errors.addError) {
      errors.addError(
        `You haven’t completed all of the required fields for at least one ${nounSingular}. Edit or delete the ${nounSingular} marked "incomplete" before continuing.`,
      );
    }
  }

  return isValid;
};

/**
 * Determines the appropriate heading level and style based on user input,
 * review page state, and whether the current path uses a minimal header layout.
 *
 * @param {string|undefined} userHeaderLevel - An optional custom heading level to use (e.g., '1', '2', '3').
 * @param {boolean} isReviewPage - Whether the current page is a review page.
 * @returns {{ headingLevel: string, headingStyle: Object }}
 * An object containing:
 *  - `headingLevel`: The resolved heading level as a string.
 *  - `headingStyle`: A style object for applying conditional font size classes.
 */
export const useHeadingLevels = (userHeaderLevel, isReviewPage) => {
  const isMinimalHeader = useMemo(() => isMinimalHeaderPath(), []);
  let defaultLevel;

  if (isMinimalHeader) {
    defaultLevel = isReviewPage ? '3' : '1';
  } else {
    defaultLevel = isReviewPage ? '4' : '3';
  }

  const headingLevel = userHeaderLevel ?? defaultLevel;
  const headingStyle = {
    'vads-u-font-size--h2': isMinimalHeader && !isReviewPage,
  };

  return { headingLevel, headingStyle };
};

/*
 * Process array data for duplicate comparison
 * @param {Array<String>} array - array of processed form data for comparison
 * @returns {String} - Combined processed form data
 */
export const processArrayData = array => {
  if (!Array.isArray(array)) {
    throw new Error('Processing array data requires an array', array);
  }
  // Make sure we're not slugifying strings with only spaces
  return slugifyText(
    array.map(item => (item || '').toString().trim()).join(';'),
  );
};

/**
 * Get item data from the array based on duplicate check settings
 * @param {string} arrayPath - The path to the array in the form data
 * @param {DuplicateChecks} duplicateChecks - The duplicate checks object
 * @param {Object} fullData - The full form data
 * @param {Number} itemIndex - The index of the item in the array
 * @returns {String} - A string representing item data for duplicate checking
 */
export const getItemDataFromPath = ({
  arrayPath,
  duplicateChecks = {},
  itemIndex,
  fullData,
}) =>
  processArrayData(
    (duplicateChecks.comparisons || []).map(path =>
      get([arrayPath, itemIndex, ...path.split('.')], fullData),
    ),
  );

/**
 * Metadata key for duplicate item tracking
 * @param {string} arrayPath - The path to the array in the form data
 * @param {DuplicateChecks} duplicateChecks - The duplicate checks object
 * @param {Number} itemIndex - The index of the item in the array
 * @param {Array<String>} [itemArray] - array of item data for used in summary
 * cards
 * @param {Object} formData - The full form data
 * @returns {String} - The metadata key for the item
 */
export const getItemDuplicateDismissedName = ({
  arrayPath,
  duplicateChecks,
  itemIndex,
  itemString = '',
  fullData = {},
}) => {
  const data =
    itemString ||
    getItemDataFromPath({
      arrayPath,
      duplicateChecks,
      itemIndex,
      fullData,
    }) ||
    '';

  return data ? [arrayPath, data, 'allowDuplicate'].join(';') : '';
};

/**
 * Get array data using duplicate checks comparisons
 * @param {string} arrayPath - The path to the array in the form data
 * @param {DuplicateChecks} duplicateChecks - The duplicate checks object
 * @param {Object} formData - The full form data
 * @returns
 */
export const getArrayDataFromDuplicateChecks = ({
  arrayPath,
  duplicateChecks,
  fullData,
}) => {
  const arrayLength = get(arrayPath, fullData)?.length || 0;

  // Build an array of data values from provided paths
  return new Array(arrayLength).fill([]).map((_, itemIndex) =>
    getItemDataFromPath({
      arrayPath,
      duplicateChecks,
      itemIndex,
      fullData,
    }),
  );
};

/**
 * @typedef {Object} DuplicateCheckResult
 * @property {Array<String>} arrayData - The array data being checked for duplicates
 * @property {Array<String>} duplicates - The list of duplicate items found
 * @property {boolean} hasDuplicate - Indicates if any duplicates were found
 * @property {Array<String>} externalComparisonData - The external comparison data
 */
/**
 * Utility function to check for duplicates in an array based on object keys
 * @param {string} arrayPath - The path to the array in the form data
 * @param {DuplicateChecks} checks - An object containing array paths of data
 * that needs to be checked for duplicates
 * @param {Object} fullData - Full form data to check for duplicates
 * @returns {DuplicateCheckResult}
 */
export const checkIfArrayHasDuplicateData = ({
  arrayPath,
  duplicateChecks = {},
  fullData,
}) => {
  const arrayData = getArrayDataFromDuplicateChecks({
    arrayPath,
    duplicateChecks,
    fullData,
  });

  let externalComparisonData = [];
  // Get external comparison data; fallback to include both internal & external
  // if comparisonType is not set to exclusively check internal data
  if (
    duplicateChecks.comparisonType !== 'internal' &&
    typeof duplicateChecks.externalComparisonData === 'function'
  ) {
    externalComparisonData = duplicateChecks.externalComparisonData({
      formData: fullData,
      arrayData,
    });
  }

  // Join all data & strip out empty strings & arrays of empty strings
  const internalComparisonData =
    duplicateChecks.comparisonType === 'external'
      ? new Set(arrayData) // ignore internal duplicates
      : arrayData;
  const allItems = [
    ...internalComparisonData,
    ...externalComparisonData.map(processArrayData),
  ].filter(item => item.replace(/;/g, '').length > 0);
  const duplicates = allItems.filter(
    (item, itemIndex) => allItems.indexOf(item) !== itemIndex,
  );
  const hasDuplicate = new Set(allItems).size !== allItems.length;

  if (hasDuplicate) {
    dispatchDuplicateItemError({
      index: arrayData.indexOf(duplicates[0]),
      arrayPath,
    });
  }

  return {
    arrayData,
    duplicates,
    externalComparisonData,
    hasDuplicate,
  };
};

export const defaultDuplicateResult = {
  arrayData: [],
  hasDuplicate: false,
  duplicates: [],
  externalComparisonData: [],
};

export const checkForDuplicatesInItemPages = ({
  arrayPath,
  duplicateChecks,
  fullData,
  index,
  itemData,
}) => {
  const itemDuplicateDismissedName = getItemDuplicateDismissedName({
    arrayPath,
    duplicateChecks,
    fullData,
    itemIndex: index || 0,
  });

  const newData = { ...fullData, [arrayPath]: fullData[arrayPath] };
  newData[arrayPath][index] = itemData;

  if (
    !duplicateChecks ||
    newData[META_DATA_KEY]?.[itemDuplicateDismissedName] ||
    !(
      duplicateChecks.externalComparisonData ||
      duplicateChecks.comparisons?.length > 0
    )
  ) {
    return defaultDuplicateResult;
  }
  return checkIfArrayHasDuplicateData({
    arrayPath,
    duplicateChecks,
    fullData: newData,
    index,
  });
};

import { useMemo } from 'react';
import get from 'platform/utilities/data/get';
import set from 'platform/utilities/data/set';
import {
  getUrlPathIndex,
  stringifyUrlParams,
} from 'platform/forms-system/src/js/helpers';
import { getEligiblePages } from 'platform/forms-system/src/js/routing';
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
 *  getSummaryPath: formData => '/array-multiple-page-builder-summary',
 *  getIntroPath: formData => '/array-multiple-page-builder',
 * }),
 * ```
 * @param {{
 *  arrayPath: string;
 *  getSummaryPath: (formData: any) => string;
 *  getIntroPath: (formData: any) => string;
 *  reviewRoute: string;
 * }} props
 */
export function onNavBackRemoveAddingItem({
  arrayPath,
  getIntroPath,
  getSummaryPath,
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

    const summaryRoute = getSummaryPath?.(formData);
    const introRoute = getIntroPath?.(formData);
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
 * Navigate back while preserving URL query params.
 *
 * If currently on a per-item page, uses the default `goPreviousPath(urlParams)`.
 * Otherwise, when backing from outside a per-item loop, it searches backward to
 * the nearest array summary page and navigates there (keeping params). On error
 * or if no target is found, falls back to `goPreviousPath(urlParams)`.
 *
 * @param {Object} args
 * @param {Object} args.formData - Current form data used to resolve eligible pages.
 * @param {(path:string)=>void} args.goPath - Function to navigate to a specific path.
 * @param {(params?:Object)=>any} args.goPreviousPath - Function to navigate to the previous path.
 * @param {Array<Object>} args.pageList - Ordered list of page configs for the flow.
 * @param {string} args.pathname - Current route pathname.
 * @param {Record<string, string | number | boolean | (string|number|boolean)[]>} args.urlParams - URL params to preserve.
 * @returns {any} Whatever the navigation function returns (often `void`).
 *
 * @example // Usage in a page config
 * const page = {
 *   uiSchema,
 *   schema,
 *   onNavBack: onNavBackKeepUrlParams,
 * };
 */
export function onNavBackKeepUrlParams({
  formData,
  goPath,
  goPreviousPath,
  pageList,
  pathname,
  urlParams,
}) {
  try {
    const { pages, pageIndex } = getEligiblePages(pageList, formData, pathname);
    if (pageIndex > 0) {
      const isPerItem = p =>
        !!(p?.showPagePerItem || p?.pageConfig?.showPagePerItem);

      const current = pages[pageIndex];
      const prev = pages[pageIndex - 1];

      // we're inside the loop, use the default behavior
      if (isPerItem(current)) return goPreviousPath(urlParams);

      // we're outside the loop, find the nearest page that is not a per-item page
      if (isPerItem(prev)) {
        let i = pageIndex - 1;
        while (i >= 0 && !pages[i]?.isArrayBuilderSummary) i -= 1;

        if (i >= 0 && pages[i]?.path) {
          const params = stringifyUrlParams(urlParams);
          return goPath(pages[i].path + (params || ''));
        }
      }
    }
  } catch {
    /* ignore and fall back */
  }

  return goPreviousPath(urlParams);
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

export function slugifyText(text, { convertCamelCase = true } = {}) {
  if (!text) return '';
  let result = text;

  if (convertCamelCase) {
    result = result.replace(/([a-z])([A-Z])/g, '$1-$2');
  }

  return result.toLowerCase().replace(/ /g, '-');
}

/**
 * Creates a path with a `updated` query param
 * @param {Object} props
 * @param {string} props.basePath e.g. `/path-summary`
 * @param {string} props.arrayPath e.g. `employers`
 * @param {string | number} props.index
 * @returns {string} e.g. `/path-summary?updated=employers-0`
 */
export function createArrayBuilderUpdatedPath({ basePath, arrayPath, index }) {
  return `${basePath}?updated=${slugifyText(arrayPath)}-${index}`;
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
 * Gets the arrayPathSlug and index from the URL `updated=` query parameter
 * @param {string} [search] e.g. `?updated=employers-0`
 * @returns {{
 *   arrayPathSlug: string | null,
 *   index: number | null,
 * }}
 */
export function getUpdatedItemFromPath(search = window?.location?.search) {
  const urlParams = getArrayUrlSearchParams(search);
  const updatedValue = urlParams.get('updated');

  const updatedItem = {
    arrayPathSlug: null,
    index: null,
  };

  try {
    const parts = updatedValue?.split('-');
    if (parts?.length) {
      const index = Number(parts.pop());
      updatedItem.index = index;
      updatedItem.arrayPathSlug = parts.join('-');
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
 * @param {Array} arrayData
 * @param {ArrayBuilderOptions['isItemIncomplete']} isItemIncomplete
 * @param {Object} fullData
 * @returns {number|null}
 */
const getFirstInvalidArrayDataIndex = (
  arrayData,
  isItemIncomplete,
  fullData,
) => {
  if (!arrayData || !arrayData.length) {
    return null;
  }

  for (let i = 0; i < arrayData.length; i++) {
    const item = arrayData[i];
    if (isItemIncomplete(item, fullData)) {
      return i;
    }
  }

  return null;
};

/**
 *
 * @param {Object} props
 * @param {Array} props.arrayData - The array data to validate
 * @param {ArrayBuilderOptions['isItemIncomplete']} props.isItemIncomplete - Function to check if an item is incomplete
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
  fullData,
}) => {
  const invalidIndex = getFirstInvalidArrayDataIndex(
    arrayData,
    isItemIncomplete,
    fullData,
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

/**
 * Resolves `maxItems` to a numeric value.
 *
 * - If `maxItems` is a function, it is called with `formData` and the returned
 *   value is validated as a number.
 * - If `maxItems` is a number, it is validated as finite and returned.
 * - If `maxItems` is a string, it is trimmed, parsed into a number, and validated.
 *
 * @param {number | string | ((formData: object) => number | string)} maxItems
 *   A static limit, string value, or resolver function.
 * @param {object} formData
 *   Data passed to the resolver when `maxItems` is a function.
 * @returns {number | undefined}
 *   The resolved maximum item count, or `undefined` if invalid or an error occurs.
 */
export const maxItemsFn = (maxItems, formData = {}) => {
  try {
    const raw = typeof maxItems === 'function' ? maxItems(formData) : maxItems;
    const value = typeof raw === 'string' ? Number(raw.trim()) : raw;
    return typeof value === 'number' && Number.isFinite(value)
      ? value
      : undefined;
  } catch {
    return undefined;
  }
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
    { convertCamelCase: false },
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

export const getDependsPath = (pages, formData) => {
  if (!pages || !pages.length) {
    return null;
  }

  if (pages.length === 1) {
    return pages[0].path;
  }

  for (let i = 0; i < pages.length; i++) {
    if (pages[i]?.depends(formData)) {
      return pages[i].path;
    }
  }

  return pages[0].path;
};

import get from 'platform/utilities/data/get';
import set from 'platform/utilities/data/set';
import { getUrlPathIndex } from 'platform/forms-system/src/js/helpers';
import { isMinimalHeaderPath } from 'platform/forms-system/src/js/patterns/minimal-header';
import { focusByOrder, focusElement } from 'platform/utilities/ui/focus';
import { scrollTo, scrollToTop } from 'platform/utilities/scroll';
import navigationState from 'platform/forms-system/src/js/utilities/navigation/navigationState';
import environment from 'platform/utilities/environment';
import { dispatchIncompleteItemError } from './ArrayBuilderEvents';
import { DEFAULT_ARRAY_BUILDER_TEXT } from './arrayBuilderText';

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

  const getTextProps = {
    getItemName,
    nounPlural,
    nounSingular,
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

/**
 * @param {string} [search] e.g. `?add=true`
 * @returns {URLSearchParams}
 */
export function getArrayUrlSearchParams(search = window?.location?.search) {
  return new URLSearchParams(search);
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
 * @param {Function} [props.addError] - Optional function to add an error
 * @returns {boolean} - Returns an object with the index of the incomplete item or null if all items are complete
 */
export const validateIncompleteItems = ({
  arrayData,
  isItemIncomplete,
  nounSingular,
  errors,
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

import get from 'platform/utilities/data/get';
import set from 'platform/utilities/data/set';
import { getUrlPathIndex } from 'platform/forms-system/src/js/helpers';
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
   * @returns {string}
   */
  return (key, itemData) => {
    const keyVal = getTextValues?.[key];
    if (key === 'getItemName' || key === 'cardDescription') {
      return typeof keyVal === 'function' ? keyVal(itemData) : keyVal;
    }
    return typeof keyVal === 'function'
      ? getTextValues?.[key]({
          ...getTextProps,
          itemData,
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

    const path =
      introRoute && !newArrayData?.length ? introRoute : summaryRoute;
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

export function formatNounSingularForUrl(nounSingular) {
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
  return `${basePath}?updated=${formatNounSingularForUrl(
    nounSingular,
  )}-${index}`;
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
 *  nounSingular: string,
 *  nounPlural: string,
 *  minItems: number,
 *  maxItems: number,
 * }} options
 */
export const minMaxItemsHint = ({
  nounSingular,
  nounPlural,
  minItems,
  maxItems,
}) => {
  let hint = '';

  if (minItems && maxItems) {
    hint += `You need to add a minimum of ${minItems} and maximum of ${maxItems} ${nounPlural}.`;
  } else if (minItems) {
    hint += `You need to add a minimum of ${minItems} ${
      minItems === 1 ? nounSingular : nounPlural
    }.`;
  } else if (maxItems) {
    hint += `You can add up to ${maxItems} ${
      minItems === 1 ? nounSingular : nounPlural
    }.`;
  }

  return hint;
};

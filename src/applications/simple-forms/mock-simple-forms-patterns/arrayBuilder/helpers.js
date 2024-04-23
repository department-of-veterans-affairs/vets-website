import get from 'platform/utilities/data/get';
import set from 'platform/utilities/data/set';
import { getUrlPathIndex } from 'platform/forms-system/src/js/helpers';

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
  return `${basePath}?updated=${nounSingular}-${index}`;
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
export function getArrayUrlSearchParams(search = window?.location?.search) {
  return new URLSearchParams(search);
}

// Used as a helper so that we can stub this for tests
export function getArrayIndexFromPathName(
  pathname = window?.location?.pathname,
) {
  return getUrlPathIndex(pathname);
}

import get from 'platform/utilities/data/get';
import set from 'platform/utilities/data/set';

/**
 * Usage:
 * ```
 * onNavBack: onNavBackRemoveAddingItem({
 *  arrayPath: 'employers',
 *  summaryPathUrl: '/array-multiple-page-builder-summary',
 * }),
 * ```
 * @param {{
 *  arrayPath: string;
 *  summaryPathUrl: string;
 * }} props
 */
export function onNavBackRemoveAddingItem({ arrayPath, summaryPathUrl }) {
  return function onNavBack({ goPath, formData, setFormData, urlParams }) {
    if ('add' in urlParams) {
      // remove current item
      const arrayData = get(arrayPath, formData);
      const newArrayData = arrayData.slice(0, -1);
      const newData = set(arrayPath, newArrayData, formData);
      setFormData(newData);
    }

    goPath(summaryPathUrl);
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
 * @param {string | number} props.index
 * @returns {string} e.g. `/path-item/0?add=true`
 */
export function createArrayBuilderItemAddPath({ path, index }) {
  return `${path.replace(':index', index)}?add=true`;
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

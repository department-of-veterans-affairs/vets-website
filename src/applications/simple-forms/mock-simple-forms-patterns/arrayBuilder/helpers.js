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
 * Gets the query params from the URL and parses them as an object
 *
 * @param {string} [queryString] optional e.g. `?add=true`
 * @returns {object} e.g. `{ add: 'true' }`
 */
export function parseQueryParams(queryString = window.location?.search) {
  return queryString?.split('?')?.reduce((acc, query) => {
    const [key, value] = query.split('=');
    return { ...acc, [key]: value };
  }, {});
}

/**
 * Creates a path with a `add` query param
 * @param {Object} props
 * @param {string} props.basePath e.g. `/path-summary`
 * @param {string | number} props.index
 * @returns {string} e.g. `/path-summary/0?add=true`
 */
export function createArrayBuilderItemAddPath({ basePath, index }) {
  return `${basePath}/${index}?add=true`;
}

/**
 * Creates a path with a `edit` query param
 * @param {Object} props
 * @param {string} props.basePath e.g. `/path-summary`
 * @param {string | number} props.index
 * @returns {string} e.g. `/path-summary/0?edit=true`
 */
export function createArrayBuilderItemEditPath({ basePath, index }) {
  return `${basePath}/${index}?edit=true`;
}

/**
 * Creates a path with a `updated` query param
 * @param {Object} props
 * @param {string} props.basePath e.g. `/path-summary`
 * @param {string} props.nounSingular e.g. `employer`
 * @param {string | number} props.index
 * @returns {string} e.g. `/path-summary?updated=employer-0`
 */
export function createArrayBuilderSummaryUpdatedPath({
  basePath,
  nounSingular,
  index,
}) {
  return `${basePath}?updated=${nounSingular}-${index}`;
}

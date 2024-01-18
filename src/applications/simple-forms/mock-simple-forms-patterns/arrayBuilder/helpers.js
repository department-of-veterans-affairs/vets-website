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

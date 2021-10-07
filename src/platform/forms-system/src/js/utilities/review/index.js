import {
  $,
  scrollElementName,
  getFocusableElements,
  focusElement,
  scrollToElement,
} from '../ui';

/**
 * @typedef FormUtility~findTargetsOptions
 * @type {object}
 * @property {boolean} getLabel - if true, return label vs actual element
 */
/**
 * @typedef FormUtility~findTargetsReturnedValues
 * @property {HTMLElement} scroll - review & submit page or chapter containing
 *  the focused element. It will be scrolled into the viewport
 * @property {string|HTMLElement} focus - review & submit page form element or
 *  associated label to be focused. This may be the same as the scroll element
 */
/**
 * Find the wrapping accordion header, or the label of a specific element inside
 * the accordion
 * @param {Form~errors} error - single error from `form.formErrors.errors`
 * @param {FormUtility~findTargetsOptions}
 * @return {FormUtility~findTargetsReturnedValues}
 */
const findTargets = (error, { getLabel = true } = {}) => {
  // find scroll element first
  const el = $(
    [
      `[name$="${error.pageKey}${scrollElementName}"]`,
      // index value indicates an array instance (saved as a string, e.g. '0')
      `[name$="${error.pageKey}${error.index || ''}${scrollElementName}"]`,
    ].join(','),
  );
  if (error.pageKey === error.chapterKey) {
    return { scroll: el, focus: el };
  }
  // Find all visible elements within the form
  const form = el?.closest('.form-review-panel-page')?.querySelectorAll('form');
  const formElements = form
    ? getFocusableElements(form[error.index] || form[0])
    : [];
  // narrow down search to a matching id (if possible)
  const firstElement =
    formElements.filter(elm => elm.id.includes(`_${error.name}`))[0] ||
    // ID may not match the name in an array block (e.g. 526 servicePeriods)
    formElements[0];
  return {
    scroll: el,
    focus:
      (getLabel
        ? firstElement
            ?.closest('.schemaform-field-container, .schemaform-field-template')
            ?.querySelector('legend, label')
        : firstElement) || el,
  };
};

/**
 * Focus on the review form accordion chapter, or form element; then scroll
 * to that element. Code is within a setTimeout since it is difficult to add a
 * ref or call this function within the componentDidMount function (both within
 * the rjsf library)
 * The error object is created by ../utilities/data/reduceErrors.js
 * @param {Form~errors} error - single error from `form.formErrors.errors`
 */
export const focusAndScrollToReviewElement = (error = {}) => {
  if (error.name) {
    // Ensure DOM updates
    setTimeout(() => {
      const { focus, scroll } = findTargets(error);
      if (focus) {
        focusElement(focus);
        scrollToElement(scroll);
      }
    }, 50);
  }
};

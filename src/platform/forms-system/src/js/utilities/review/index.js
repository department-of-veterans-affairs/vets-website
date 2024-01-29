import { $, scrollToElement } from '../ui';
import { SCROLL_ELEMENT_SUFFIX } from '../../../../../utilities/constants';

/**
 * @typedef FormUtility~findTargetsOptions
 * @type {object}
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
const findTargets = error => {
  // find scroll element first
  const el = $(
    [
      `[name$="${error.pageKey}${SCROLL_ELEMENT_SUFFIX}"]`,
      // index value indicates an array instance (saved as a string, e.g. '0')
      `[name$="${error.pageKey}${error.index || ''}${SCROLL_ELEMENT_SUFFIX}"]`,
    ].join(','),
  );

  return {
    scroll: el,
  };
};

/**
 * Open the accordion for the specified chapter and click on the "Edit" button
 * to go into edit mode. This will also result in the focusing of the first
 * interactive element in the content.
 * @param {String} chapterKey - a chapter key
 */
export const openAndEditChapter = error => {
  const accordionItem = document.querySelector(
    `va-accordion-item[data-chapter="${error.chapterKey}"`,
  );

  const accordionItemButton = accordionItem.shadowRoot.querySelector(
    "button[aria-controls='content']",
  );

  accordionItemButton.click();

  const pageTarget = findTargets(error).scroll;

  const editButton = pageTarget.parentNode.querySelector('va-button');

  // editButton will be undefined if it's already in the edit state
  editButton?.click();
};

/**
 * Focus on the review form accordion chapter, or form element; then scroll
 * to that element. Code is within a setTimeout since it is difficult to add a
 * ref or call this function within the componentDidMount function (both within
 * the rjsf library)
 * The error object is created by ../utilities/data/reduceErrors.js
 * @param {Form~errors} error - single error from `form.formErrors.errors`
 */
export const scrollToReviewElement = (error = {}) => {
  if (error.name) {
    // Ensure DOM updates
    setTimeout(() => {
      const { scroll } = findTargets(error);
      if (scroll) {
        scrollToElement(scroll);
      }
    }, 50);
  }
};

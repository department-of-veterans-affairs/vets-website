/**
 * @module utils/buildMajorStepsFromConfig
 * @description Builds major navigation steps from form configuration for the 526EZ side navigation.
 * Evaluates conditional pages based on form data to determine visible chapters and active state.
 */
import {
  createFormPageList,
  createPageList,
  getActiveExpandedPages,
} from '@department-of-veterans-affairs/platform-forms-system/helpers';
import formConfig from '../config/form';

/**
 * @typedef {Object} MajorStep
 * @property {number} idx - Index in the chapter list
 * @property {string} key - Unique chapter key (e.g., 'veteranDetails', 'disabilities')
 * @property {string} label - Display label for the chapter
 * @property {string} primaryPath - Primary navigation path for the chapter (first visible page)
 * @property {string[]} pathPrefixes - All page paths within this chapter (for active state matching)
 * @property {boolean} [terminal] - Whether this is the final review step
 */

/**
 * Mapping of form chapters to navigation labels
 * @const {Array<{key: string, label: string}>}
 */
const CHAPTER_STEP_MAP = [
  { key: 'veteranDetails', label: 'Veteran Details' },
  { key: 'disabilities', label: 'Conditions' },
  { key: 'mentalHealth', label: 'Mental Health' },
  { key: 'supportingEvidence', label: 'Supporting Evidence' },
  { key: 'additionalInformation', label: 'Additional Information' },
];

/**
 * Review and submit step configuration
 * @const {MajorStep}
 */
const REVIEW_STEP = {
  key: 'reviewSubmit',
  label: 'Review and Submit',
  path: '/review-and-submit',
};

/**
 * Builds list of major navigation steps from form configuration
 *
 * Evaluates each chapter's pages and determines:
 * - All page paths within the chapter (pathPrefixes)
 * - The primary navigation path (first visible page based on depends functions)
 *
 * @param {Object} formData - Current form data from Redux store
 * @returns {MajorStep[]} Array of major navigation steps
 */
export function buildMajorSteps(formData, pathname) {
  // This is converting the config into a list of pages with chapter keys,
  // finding the current page, then getting the chapter name using the key
  //  - borrowed from platform/forms-system/src/js/components/FormNav.jsx
  const formPages = createFormPageList(formConfig);
  const pageList = createPageList(formConfig, formPages);
  const eligiblePageList = getActiveExpandedPages(pageList, formData);

  // include current chapter as 'current-page' bool in the steps builder below
  const page = eligiblePageList.find(p => p.path === pathname);
  const currentChapter = page?.chapterKey || '';

  const steps = [];

  CHAPTER_STEP_MAP.forEach(({ key, label }, idx) => {
    const pathPrefixes = eligiblePageList.filter(p => p.chapterKey === key);
    const primaryPage = pathPrefixes[0];

    steps.push({
      idx,
      key,
      label,
      path: primaryPage?.path,
      current: key === currentChapter,
    });
  });

  // add review page
  steps.push({
    ...REVIEW_STEP,
    current: currentChapter === 'review',
    idx: steps.length + 1,
  });
  return steps;
}

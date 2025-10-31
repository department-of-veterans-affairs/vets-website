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
 * Evaluates each chapter's pages against form data to determine which pages are currently
 * visible based on their 'depends' functions. Returns an array of major steps with:
 * - Chapter index, key, and label
 * - Primary navigation path (first visible page in the chapter)
 * - Current state (whether the pathname matches this chapter)
 *
 * @param {Object} formData - Current form data from Redux store, used to evaluate conditional pages
 * @param {string} pathname - Current URL pathname to determine active chapter
 * @returns {MajorStep[]} Array of major navigation steps with current state
 */
export function buildMajorSteps(formData, pathname) {
  /**
   * Convert form config to page list and filter based on form data
   * This logic is borrowed from platform/forms-system/src/js/components/FormNav.jsx
   */
  const formPages = createFormPageList(formConfig);
  const pageList = createPageList(formConfig, formPages);
  const eligiblePageList = getActiveExpandedPages(pageList, formData);

  /**
   * Determine current chapter by matching pathname to eligible pages
   */
  const page = eligiblePageList.find(p => p.path === pathname);
  const currentChapter = page?.chapterKey || '';

  const steps = [];

  /**
   * Build navigation steps from chapter map
   * Each step includes the first visible page path for that chapter
   */
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

  steps.push({
    ...REVIEW_STEP,
    current: currentChapter === 'review',
    idx: steps.length + 1,
  });
  return steps;
}

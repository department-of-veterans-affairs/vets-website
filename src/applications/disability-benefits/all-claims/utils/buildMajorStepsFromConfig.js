/**
 * @module utils/buildMajorStepsFromConfig
 * @description Builds major navigation steps from form configuration for the 526EZ side navigation.
 * Evaluates conditional pages based on form data to determine visible chapters and active state.
 */

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
  primaryPath: '/review-and-submit',
  pathPrefixes: ['/review-and-submit', '/review', '/submit'],
  terminal: true,
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
export function buildMajorSteps(formData) {
  const { chapters } = formConfig;
  const steps = [];

  CHAPTER_STEP_MAP.forEach(({ key, label }, idx) => {
    const chapter = chapters[key];
    if (!chapter) return;

    const pages = Object.values(chapter.pages || {});

    /** Collect all distinct paths (prefix them with slash for consistency) */
    const pathPrefixes = pages
      .map(p => p.path)
      .filter(Boolean)
      .map(p => (p.startsWith('/') ? p : `/${p}`));

    if (pathPrefixes.length === 0) return;

    /**
     * Determine primary path using heuristic:
     * 1. First page with non-empty title AND path AND valid depends (if any)
     * 2. Fallback to first page with path
     */
    const primaryCandidate =
      pages.find(p => {
        /** Avoid hidden pages based on current formData */
        if (typeof p.depends === 'function' && !p.depends(formData)) {
          return false;
        }
        return (
          typeof p.title === 'string' &&
          p.title.trim() !== '' &&
          p.path &&
          !p.path.includes('page-break')
        );
      }) || pages.find(p => p.path);

    const primaryPath = primaryCandidate
      ? `/${primaryCandidate.path}`.replace(/\/{2,}/g, '/')
      : pathPrefixes[0];

    steps.push({
      idx,
      key,
      label,
      primaryPath,
      pathPrefixes,
    });
  });

  steps.push(REVIEW_STEP);
  return steps;
}

/**
 * Finds the active major step based on current pathname
 *
 * Matches the current URL against all chapter path prefixes to determine
 * which chapter is currently active. Uses formData to rebuild steps with
 * current conditional page visibility.
 *
 * @param {string} pathname - Current URL pathname from react-router
 * @param {Object} formData - Current form data from Redux store
 * @returns {MajorStep|undefined} The active major step, or undefined if no match
 */
export function findActiveMajorStep(pathname, formData) {
  const clean = pathname.replace(/\/+$/, '').toLowerCase();
  return buildMajorSteps(formData).find(step =>
    step.pathPrefixes.some(prefix => clean.startsWith(prefix.toLowerCase())),
  );
}

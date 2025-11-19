import { useEffect } from 'react';
import navigationState from 'platform/forms-system/src/js/utilities/navigation/navigationState';

/**
 * Hook to guard/validate rendering of array builder item pages.
 * Handles navigation redirects and conditional rendering based on page state.
 *
 * @param {Object} params
 * @param {boolean} params.onReviewPage - Whether we're on the review page
 * @param {boolean} params.isEdit - Whether in edit mode (?edit=true)
 * @param {boolean} params.isAdd - Whether in add mode (?add=true)
 * @param {Object|null} params.schema - Schema object (null when initially loading edit mode)
 * @param {Object} params.data - Form data
 * @param {Array} params.fullData - Full form data array
 * @param {Function} params.required - Function to check if array is required
 * @param {string} params.introRoute - Path to intro page
 * @param {string} params.summaryRoute - Path to summary page
 * @param {Function} params.goToPath - Navigation function
 * @returns {boolean} Whether the page should render
 */
export function useItemPageGuard({
  onReviewPage,
  isEdit,
  isAdd,
  schema,
  data,
  fullData,
  required,
  introRoute,
  summaryRoute,
  goToPath,
}) {
  useEffect(
    () => {
      if (!onReviewPage && !isEdit && !isAdd) {
        // we should only arrive at this page with
        // ?add=true or ?edit=true, so if we somehow
        // get here without those, redirect to the
        // summary/intro
        const path =
          required(data) && introRoute && !fullData?.length
            ? introRoute
            : summaryRoute;

        // We might end up here from a save in progress continue,
        // but ?add=true or ?edit=true won't be set...
        // Consider how to handle this in the future, so save in progress can work.
        // In the meantime, go back to intro or summary, and set navigation event
        // so that validation for missing info will work properly.
        navigationState.setNavigationEvent();
        goToPath(path);
      }
    },
    [
      onReviewPage,
      isEdit,
      isAdd,
      data,
      fullData,
      required,
      introRoute,
      summaryRoute,
      goToPath,
    ],
  );

  // Don't render if:
  // 1. On review page
  // 2. In edit mode but schema hasn't loaded yet
  if (onReviewPage || (isEdit && !schema)) {
    return false;
  }

  // Don't render if missing required URL params (handled by useEffect redirect)
  if (!onReviewPage && !isEdit && !isAdd) {
    return false;
  }

  return true;
}

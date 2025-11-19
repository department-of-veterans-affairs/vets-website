import { useEffect } from 'react';
import navigationState from 'platform/forms-system/src/js/utilities/navigation/navigationState';
import { getArrayUrlSearchParams } from './helpers';

/**
 * Hook to guard/validate rendering of array builder item pages.
 * Handles navigation redirects and conditional rendering based on page state.
 *
 * @param {Object} params
 * @param {Object} params.arrayBuilderProps - Array builder configuration props
 * @param {Object} params.customPageProps - Component props from CustomPage
 * @param {Object|null} params.schema - Schema object (null when initially loading edit mode)
 * @param {Array} params.fullData - Full form data array
 * @returns {boolean} Whether the page should render
 */
export function useItemPageGuard({
  arrayBuilderProps,
  customPageProps,
  schema,
  fullData,
}) {
  // Derive edit/add mode from URL params
  const searchParams = getArrayUrlSearchParams();
  const isEdit = !!searchParams.get('edit');
  const isAdd = !!searchParams.get('add');

  const { required, introRoute, summaryRoute } = arrayBuilderProps;
  const { onReviewPage, data, goToPath } = customPageProps;
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
  // 3. Missing required URL params (handled by useEffect redirect)
  return (
    !onReviewPage && !(isEdit && !schema) && (isEdit || isAdd || onReviewPage)
  );
}

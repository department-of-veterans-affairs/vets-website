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
  waitForSchema = true,
}) {
  const searchParams = getArrayUrlSearchParams();
  const isEdit = !!searchParams.get('edit');
  const isAdd = !!searchParams.get('add');
  const checkSchema = waitForSchema ? customPageProps.schema !== null : true;
  const introRoute = arrayBuilderProps.getIntroPath(customPageProps.fullData);
  const summaryRoute = arrayBuilderProps.getSummaryPath(
    customPageProps.fullData,
  );

  if (!customPageProps.onReviewPage && !isEdit && !isAdd) {
    // we should only arrive at this page with
    // ?add=true or ?edit=true, so if we somehow
    // get here without those, redirect to the
    // summary/intro
    const path =
      arrayBuilderProps.required(customPageProps.data) && introRoute
        ? introRoute
        : summaryRoute;

    // We might end up here from a save in progress continue,
    // but ?add=true or ?edit=true won't be set...
    // Consider how to handle this in the future, so save in progress can work.
    // In the meantime, go back to intro or summary, and set navigation event
    // so that validation for missing info will work properly.
    navigationState.setNavigationEvent();
    customPageProps.goToPath(path);
    return false;
  }

  // eslint-disable-next-line sonarjs/prefer-single-boolean-return
  if (customPageProps.onReviewPage || (isEdit && !checkSchema)) {
    // 1. Don't show for review page.
    // 2. If we're editing, the schema will initially be null
    //    so just return null until schema is loaded by useState
    return false;
  }

  return true;
}

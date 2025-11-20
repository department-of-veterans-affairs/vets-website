import navigationState from 'platform/forms-system/src/js/utilities/navigation/navigationState';
import { getArrayUrlSearchParams } from './helpers';

/**
 * Hook to guard/validate rendering of array builder item pages.
 * Handles navigation redirects and conditional rendering based on page state.
 *
 * @param {Object} params
 * @param {Object} params.arrayBuilderProps - Array builder configuration props
 * @param {Object} params.customPageProps - Component props from CustomPage
 * @param {Object|null} [params.schema] - Schema from useEditOrAddForm
 * @param {boolean} [params.checkForAddEdit=true] - Whether to enforce ?add=true or ?edit=true query params.
 *   When true, redirects to intro/summary if neither param is present.
 * @param {boolean} [params.checkForReview=true] - Whether to prevent rendering on review page.
 *   When true, returns false if on review page.
 * @param {boolean} [params.checkForEditSchema=true] - Whether to wait for schema to load in edit mode.
 *   When true, returns false if editing and schema is null.
 * @returns {boolean} Whether the page should render
 */
export function useItemPageGuard({
  arrayBuilderProps,
  customPageProps,
  schema,
  checkForAddEdit = true,
  checkForReview = true,
  checkForEditSchema = true,
}) {
  const searchParams = getArrayUrlSearchParams();
  const isEdit = !!searchParams.get('edit');
  const isAdd = !!searchParams.get('add');
  const introRoute = arrayBuilderProps.getIntroPath(customPageProps.fullData);
  const summaryRoute = arrayBuilderProps.getSummaryPath(
    customPageProps.fullData,
  );

  if (checkForAddEdit && !customPageProps.onReviewPage && !isEdit && !isAdd) {
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
    // Don't render
    return false;
  }

  if (checkForReview && customPageProps.onReviewPage) {
    // Don't render
    return false;
  }

  // eslint-disable-next-line sonarjs/prefer-single-boolean-return
  if (checkForEditSchema && isEdit && !schema) {
    // Don't render
    return false;
  }

  // All checks passed, we can render
  return true;
}

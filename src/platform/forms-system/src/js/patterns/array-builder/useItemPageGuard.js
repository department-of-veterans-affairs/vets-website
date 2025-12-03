import navigationState from 'platform/forms-system/src/js/utilities/navigation/navigationState';
import { getArrayUrlSearchParams } from './helpers';

/**
 * Handles navigation redirects and conditional rendering based on page state
 * For ArrayBuilderItemPage or ArrayBuilderItemPage CustomPage
 *
 * @param {Object} options
 * @param {ArrayBuilderItemPageProps} options.arrayBuilderProps from `props.arrayBuilder` for CustomPages, or directly passed in for ArrayBuilderItemPage
 * @param {CustomPageProps} options.customPageProps
 * @param {Object|null} [options.schema]
 * @param {boolean} [options.checkForAddEdit=true]
 * @param {boolean} [options.checkForReview=true]
 * @param {boolean} [options.checkForEditSchema=true]
 * @returns {boolean} shouldRender
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

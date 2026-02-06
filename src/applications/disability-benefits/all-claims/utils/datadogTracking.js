import { VA_FORM_IDS } from '@department-of-veterans-affairs/platform-forms/constants';

/**
 * Creates a tracking callback for back button clicks in the 526EZ form
 * This function maintains a session-based click counter and gathers
 * feature toggle and side nav usage data for DataDog RUM tracking
 *
 * @param {object} params - Parameters for tracking
 * @param {object} params.featureToggles - Feature toggles from Redux state
 * @param {object} params.formData - Current form data containing side nav state
 * @param {string} params.pathname - Current page pathname
 * @returns {object} Object with actionName and properties for DataDog
 */
export const getBackButtonTrackingData = ({
  featureToggles,
  formData,
  pathname,
}) => {
  // Track back button clicks in sessionStorage
  const storageKey = `${VA_FORM_IDS.FORM_21_526EZ}_backButtonClickCount`;
  const currentCount = parseInt(sessionStorage.getItem(storageKey) || '0', 10);
  const newCount = currentCount + 1;
  sessionStorage.setItem(storageKey, newCount.toString());

  // Prepare DataDog action properties
  const properties = {
    formId: VA_FORM_IDS.FORM_21_526EZ,
    pathname,
    clickCount: newCount,
  };

  // Add sidenav feature toggle status
  if (featureToggles?.disability526SidenavEnabled !== undefined) {
    properties.sidenav526ezEnabled = featureToggles.disability526SidenavEnabled;
  }

  // Add chapter index if user has used side nav
  if (formData?.['view:sideNavChapterIndex'] !== undefined) {
    properties.sideNavChapterIndex = formData['view:sideNavChapterIndex'];
  }

  return {
    actionName: 'Form navigation - Back button clicked',
    properties,
  };
};

/**
 * Creates a tracking callback for "Finish this application later" link clicks
 * This function gathers feature toggle and side nav usage data for DataDog RUM tracking
 *
 * @param {object} params - Parameters for tracking
 * @param {object} params.featureToggles - Feature toggles from Redux state
 * @param {object} params.formData - Current form data containing side nav state
 * @param {string} params.pathname - Current page pathname
 * @returns {object} Object with actionName and properties for DataDog
 */
export const getSaveFormTrackingData = ({
  featureToggles,
  formData,
  pathname,
}) => {
  // Prepare DataDog action properties
  const properties = {
    formId: VA_FORM_IDS.FORM_21_526EZ,
    pathname,
  };

  // Add sidenav feature toggle status
  if (featureToggles?.disability526SidenavEnabled !== undefined) {
    properties.sidenav526ezEnabled = featureToggles.disability526SidenavEnabled;
  }

  // Add chapter index if user has used side nav
  if (formData?.['view:sideNavChapterIndex'] !== undefined) {
    properties.sideNavChapterIndex = formData['view:sideNavChapterIndex'];
  }

  return {
    actionName: 'Form save in progress - Finish this application later clicked',
    properties,
  };
};

/**
 * Creates a tracking callback for continue button clicks in the 526EZ form
 * This function maintains a session-based click counter and gathers
 * feature toggle and side nav usage data for DataDog RUM tracking
 *
 * @param {object} params - Parameters for tracking
 * @param {object} params.featureToggles - Feature toggles from Redux state
 * @param {object} params.formData - Current form data containing side nav state
 * @param {string} params.pathname - Current page pathname
 * @returns {object} Object with actionName and properties for DataDog
 */
export const getContinueButtonTrackingData = ({
  featureToggles,
  formData,
  pathname,
}) => {
  // Track continue button clicks in sessionStorage
  const storageKey = `${VA_FORM_IDS.FORM_21_526EZ}_continueButtonClickCount`;
  const currentCount = parseInt(sessionStorage.getItem(storageKey) || '0', 10);
  const newCount = currentCount + 1;
  sessionStorage.setItem(storageKey, newCount.toString());

  // Prepare DataDog action properties
  const properties = {
    formId: VA_FORM_IDS.FORM_21_526EZ,
    pathname,
    clickCount: newCount,
  };

  // Add sidenav feature toggle status
  if (featureToggles?.disability526SidenavEnabled !== undefined) {
    properties.sidenav526ezEnabled = featureToggles.disability526SidenavEnabled;
  }

  // Add chapter index if user has used side nav
  if (formData?.['view:sideNavChapterIndex'] !== undefined) {
    properties.sideNavChapterIndex = formData['view:sideNavChapterIndex'];
  }

  return {
    actionName: 'Form navigation - Continue button clicked',
    properties,
  };
};

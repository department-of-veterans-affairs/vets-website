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

/**
 * Creates tracking data for when user starts the form from introduction page
 * This function tracks the initial form start event (not resumption)
 *
 * @param {object} params - Parameters for tracking
 * @param {object} params.featureToggles - Feature toggles from Redux state
 * @param {string} params.pathname - Current page pathname (first form page)
 * @returns {object} Object with actionName and properties for DataDog
 */
export const getFormStartedTrackingData = ({ featureToggles, pathname }) => {
  const properties = {
    formId: VA_FORM_IDS.FORM_21_526EZ,
    firstPagePath: pathname,
  };

  // Add sidenav feature toggle status
  if (featureToggles?.disability526SidenavEnabled !== undefined) {
    properties.sidenav526ezEnabled = featureToggles.disability526SidenavEnabled;
  }

  return {
    actionName: 'Form started - User began form from introduction page',
    properties,
  };
};

/**
 * Creates tracking data for when user resumes a saved form
 * This function tracks form resumption (not initial start)
 *
 * @param {object} params - Parameters for tracking
 * @param {object} params.featureToggles - Feature toggles from Redux state
 * @param {object} params.formData - Form data being resumed
 * @param {string} params.returnUrl - URL where user is being redirected
 * @returns {object} Object with actionName and properties for DataDog
 */
export const getFormResumptionTrackingData = ({
  featureToggles,
  formData,
  returnUrl,
}) => {
  const properties = {
    formId: VA_FORM_IDS.FORM_21_526EZ,
    returnUrl,
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
    actionName: 'Form resumption - Saved form loaded',
    properties,
  };
};

/**
 * Creates tracking data for side nav chapter clicks
 * This tracks when users navigate via the side navigation menu
 *
 * @param {object} params - Parameters for tracking
 * @param {object} params.pageData - Page data including key, label, and path
 * @param {string} params.currentPathname - Current page pathname before navigation
 * @returns {object} Object with actionName and properties for DataDog
 */
export const getSideNavChapterClickedTrackingData = ({
  pageData,
  currentPathname,
}) => {
  const properties = {
    formId: VA_FORM_IDS.FORM_21_526EZ,
    chapterTitle: pageData.label,
    sourcePath: currentPathname,
  };

  return {
    actionName: 'Side navigation - Chapter clicked',
    properties,
  };
};

/**
 * Creates tracking data for successful form submission
 * This tracks when the user successfully submits the 526EZ form
 * Note: DataDog automatically captures user id, session id, timestamp, and device type
 *
 * @param {object} params - Parameters for tracking
 * @param {object} params.featureToggles - Feature toggles from Redux state
 * @param {string} params.pathname - Current page pathname (review/submit page)
 * @returns {object} Object with actionName and properties for DataDog
 */
export const getFormSubmittedTrackingData = ({ featureToggles, pathname }) => {
  const properties = {
    formId: VA_FORM_IDS.FORM_21_526EZ,
  };

  // Add sidenav feature toggle status
  if (featureToggles?.disability526SidenavEnabled !== undefined) {
    properties.sidenav526ezEnabled = featureToggles.disability526SidenavEnabled;
  }

  // Add source page path if available
  if (pathname) {
    properties.sourcePath = pathname;
  }

  return {
    actionName: 'Form submission - Form successfully submitted',
    properties,
  };
};

/**
 * Creates tracking data for mobile sidenav accordion expand/collapse
 * This tracks when users interact with the mobile accordion to show/hide navigation
 * Note: DataDog automatically captures user id, session id, timestamp, and device type
 *
 * @param {object} params - Parameters for tracking
 * @param {string} params.pathname - Current page pathname
 * @param {string} params.state - Accordion state: 'expanded' or 'collapsed'
 * @param {string} params.accordionTitle - Title of the accordion (e.g., "Form steps")
 * @returns {object} Object with actionName and properties for DataDog
 */
export const getMobileAccordionTrackingData = ({
  pathname,
  state,
  accordionTitle,
}) => {
  const properties = {
    formId: VA_FORM_IDS.FORM_21_526EZ,
    state,
    accordionTitle,
  };

  // Add source page path
  if (pathname) {
    properties.sourcePath = pathname;
  }

  return {
    actionName: 'Side navigation - Mobile accordion clicked',
    properties,
  };
};

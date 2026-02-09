import { VA_FORM_IDS } from '@department-of-veterans-affairs/platform-forms/constants';
import { datadogRum } from '@datadog/browser-rum';

/**
 * Helper function to track DataDog RUM actions
 * Centralizes all datadogRum.addAction calls for easier debugging and maintenance
 * Wrapped in try-catch to ensure tracking failures never break the form
 *
 * @param {string} actionName - Name of the action to track
 * @param {object} properties - Properties to attach to the action
 */
const trackAction = (actionName, properties) => {
  try {
    datadogRum.addAction(actionName, properties);
    // Uncomment for debugging:
    // eslint-disable-next-line no-console
    console.log(`[DataDog Tracking] ${actionName}:`, properties);
  } catch (error) {
    // Silent fail - tracking should never break the form
    // eslint-disable-next-line no-console
    console.error('[DataDog Tracking Error]', error);
  }
};

/**
 * Tracks back button clicks in the 526EZ form
 * Maintains a session-based click counter and gathers
 * feature toggle and side nav usage data for DataDog RUM tracking
 *
 * @param {object} params - Parameters for tracking
 * @param {object} params.featureToggles - Feature toggles from Redux state
 * @param {object} params.formData - Current form data containing side nav state
 * @param {string} params.pathname - Current page pathname
 */
export const trackBackButtonClick = ({
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
    sourcePath: pathname,
    clickCount: newCount,
  };

  // Add sidenav feature toggle status
  if (featureToggles?.disability526SidenavEnabled !== undefined) {
    properties.sidenav526ezEnabled = featureToggles.disability526SidenavEnabled;
  }

  // Track if user has side nav enabled (boolean)
  properties.sidenavIsActive =
    formData?.['view:sideNavChapterIndex'] !== undefined;

  trackAction('Form navigation - Back button clicked', properties);
};

/**
 * Tracks "Finish this application later" link clicks
 * Gathers feature toggle and side nav usage data for DataDog RUM tracking
 *
 * @param {object} params - Parameters for tracking
 * @param {object} params.featureToggles - Feature toggles from Redux state
 * @param {object} params.formData - Current form data containing side nav state
 * @param {string} params.pathname - Current page pathname
 */
export const trackSaveFormClick = ({ featureToggles, formData, pathname }) => {
  // Prepare DataDog action properties
  const properties = {
    formId: VA_FORM_IDS.FORM_21_526EZ,
    sourcePath: pathname,
  };

  // Add sidenav feature toggle status
  if (featureToggles?.disability526SidenavEnabled !== undefined) {
    properties.sidenav526ezEnabled = featureToggles.disability526SidenavEnabled;
  }

  // Track if user has side nav enabled (boolean)
  properties.sidenavIsActive =
    formData?.['view:sideNavChapterIndex'] !== undefined;

  trackAction(
    'Form save in progress - Finish this application later clicked',
    properties,
  );
};

/**
 * Tracks continue button clicks in the 526EZ form
 * Maintains a session-based click counter and gathers
 * feature toggle and side nav usage data for DataDog RUM tracking
 *
 * @param {object} params - Parameters for tracking
 * @param {object} params.featureToggles - Feature toggles from Redux state
 * @param {object} params.formData - Current form data containing side nav state
 * @param {string} params.pathname - Current page pathname
 */
export const trackContinueButtonClick = ({
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
    sourcePath: pathname,
    clickCount: newCount,
  };

  // Add sidenav feature toggle status
  if (featureToggles?.disability526SidenavEnabled !== undefined) {
    properties.sidenav526ezEnabled = featureToggles.disability526SidenavEnabled;
  }

  // Track if user has side nav enabled (boolean)
  properties.sidenavIsActive =
    formData?.['view:sideNavChapterIndex'] !== undefined;

  trackAction('Form navigation - Continue button clicked', properties);
};

/**
 * Tracks when user starts the form from introduction page
 * This tracks the initial form start event (not resumption)
 *
 * @param {object} params - Parameters for tracking
 * @param {object} params.featureToggles - Feature toggles from Redux state
 * @param {object} params.formData - Current form data containing side nav state
 * @param {string} params.pathname - Current page pathname (first form page)
 */
export const trackFormStarted = ({ featureToggles, formData, pathname }) => {
  const properties = {
    formId: VA_FORM_IDS.FORM_21_526EZ,
    sourcePath: pathname,
  };

  // Add sidenav feature toggle status
  if (featureToggles?.disability526SidenavEnabled !== undefined) {
    properties.sidenav526ezEnabled = featureToggles.disability526SidenavEnabled;
  }

  // Track if user has used side nav (boolean)
  properties.sidenavIsActive =
    formData?.['view:sideNavChapterIndex'] !== undefined;

  trackAction(
    'Form started - User began form from introduction page',
    properties,
  );
};

/**
 * Tracks when user resumes a saved form
 * This tracks form resumption (not initial start)
 *
 * @param {object} params - Parameters for tracking
 * @param {object} params.featureToggles - Feature toggles from Redux state
 * @param {object} params.formData - Form data being resumed
 * @param {string} params.returnUrl - URL where user is being redirected
 */
export const trackFormResumption = ({
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

  // Track if user has side nav enabled (boolean)
  properties.sidenavIsActive =
    formData?.['view:sideNavChapterIndex'] !== undefined;

  trackAction('Form resumption - Saved form loaded', properties);
};

/**
 * Tracks side nav chapter clicks
 * This tracks when users navigate via the side navigation menu
 *
 * @param {object} params - Parameters for tracking
 * @param {object} params.pageData - Page data including key, label, and path
 * @param {string} params.pathname - Current page pathname before navigation
 */
export const trackSideNavChapterClick = ({ pageData, pathname }) => {
  const properties = {
    formId: VA_FORM_IDS.FORM_21_526EZ,
    chapterTitle: pageData.label,
    sourcePath: pathname,
  };

  trackAction('Side navigation - Chapter clicked', properties);
};

/**
 * Tracks successful form submission
 * This tracks when the user successfully submits the 526EZ form
 * Note: DataDog automatically captures user id, session id, timestamp, and device type
 *
 * @param {object} params - Parameters for tracking
 * @param {object} params.featureToggles - Feature toggles from Redux state
 * @param {object} params.formData - Current form data containing side nav state
 * @param {string} params.pathname - Current page pathname (review/submit page)
 */
export const trackFormSubmitted = ({ featureToggles, formData, pathname }) => {
  const properties = {
    formId: VA_FORM_IDS.FORM_21_526EZ,
  };

  // Add sidenav feature toggle status
  if (featureToggles?.disability526SidenavEnabled !== undefined) {
    properties.sidenav526ezEnabled = featureToggles.disability526SidenavEnabled;
  }

  // Track if user has used side nav (boolean)
  properties.sidenavIsActive =
    formData?.['view:sideNavChapterIndex'] !== undefined;

  properties.sourcePath = pathname;

  trackAction('Form submission - Form successfully submitted', properties);
};

/**
 * Tracks mobile sidenav accordion expand/collapse
 * This tracks when users interact with the mobile accordion to show/hide navigation
 * Note: DataDog automatically captures user id, session id, timestamp, and device type
 *
 * @param {object} params - Parameters for tracking
 * @param {string} params.pathname - Current page pathname
 * @param {string} params.state - Accordion state: 'expanded' or 'collapsed'
 * @param {string} params.accordionTitle - Title of the accordion (e.g., "Form steps")
 */
export const trackMobileAccordionClick = ({
  pathname,
  state,
  accordionTitle,
}) => {
  const properties = {
    formId: VA_FORM_IDS.FORM_21_526EZ,
    state,
    accordionTitle,
    sourcePath: pathname,
  };

  trackAction('Side navigation - Mobile accordion clicked', properties);
};

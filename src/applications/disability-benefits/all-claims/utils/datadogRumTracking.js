import { VA_FORM_IDS } from '@department-of-veterans-affairs/platform-forms/constants';
import { datadogRum } from '@datadog/browser-rum';
import {
  SIDENAV_COMPONENT_ID,
  TRACKING_BACK_BUTTON_CLICKS,
  TRACKING_CONTINUE_BUTTON_CLICKS,
  TRACKING_FORM_RESUMPTION,
} from '../constants';

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
 * @param {string} params.pathname - Current page pathname
 */
export const trackBackButtonClick = ({ featureToggles, pathname }) => {
  // Track back button clicks in sessionStorage
  const currentCount = parseInt(
    sessionStorage.getItem(TRACKING_BACK_BUTTON_CLICKS) || '0',
    10,
  );
  const newCount = currentCount + 1;
  sessionStorage.setItem(TRACKING_BACK_BUTTON_CLICKS, newCount.toString());

  // Prepare DataDog action properties
  const properties = {
    formId: VA_FORM_IDS.FORM_21_526EZ,
    sourcePath: pathname,
    clickCount: newCount,
  };

  // Add sidenav feature toggle status
  if (featureToggles?.sidenav526ezEnabled !== undefined) {
    properties.sidenav526ezEnabled = featureToggles.sidenav526ezEnabled;
  }

  // Track if side nav component is actually rendered on page (accounts for gradual rollout)
  properties.sidenavIsActive = !!document.getElementById(SIDENAV_COMPONENT_ID);

  trackAction('Form navigation - Back button clicked', properties);
};

/**
 * Tracks "Finish this application later" link clicks
 * Gathers feature toggle and side nav usage data for DataDog RUM tracking
 *
 * @param {object} params - Parameters for tracking
 * @param {object} params.featureToggles - Feature toggles from Redux state
 * @param {string} params.pathname - Current page pathname
 */
export const trackSaveFormClick = ({ featureToggles, pathname }) => {
  // Prepare DataDog action properties
  const properties = {
    formId: VA_FORM_IDS.FORM_21_526EZ,
    sourcePath: pathname,
  };

  // Add sidenav feature toggle status
  if (featureToggles?.sidenav526ezEnabled !== undefined) {
    properties.sidenav526ezEnabled = featureToggles.sidenav526ezEnabled;
  }

  // Track if side nav component is actually rendered on page (accounts for gradual rollout)
  properties.sidenavIsActive = !!document.getElementById(SIDENAV_COMPONENT_ID);

  // Clear form resumption tracking flag so if user resumes again in same session, it tracks
  sessionStorage.removeItem(TRACKING_FORM_RESUMPTION);

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
 * @param {string} params.pathname - Current page pathname
 */
export const trackContinueButtonClick = ({ featureToggles, pathname }) => {
  // Track continue button clicks in sessionStorage
  const currentCount = parseInt(
    sessionStorage.getItem(TRACKING_CONTINUE_BUTTON_CLICKS) || '0',
    10,
  );
  const newCount = currentCount + 1;
  sessionStorage.setItem(TRACKING_CONTINUE_BUTTON_CLICKS, newCount.toString());

  // Prepare DataDog action properties
  const properties = {
    formId: VA_FORM_IDS.FORM_21_526EZ,
    sourcePath: pathname,
    clickCount: newCount,
  };

  // Add sidenav feature toggle status
  if (featureToggles?.sidenav526ezEnabled !== undefined) {
    properties.sidenav526ezEnabled = featureToggles.sidenav526ezEnabled;
  }

  // Track if side nav component is actually rendered on page (accounts for gradual rollout)
  properties.sidenavIsActive = !!document.getElementById(SIDENAV_COMPONENT_ID);

  trackAction('Form navigation - Continue button clicked', properties);
};

/**
 * Tracks when user starts the form from introduction page
 * This tracks the initial form start event (not resumption)
 *
 * @param {object} params - Parameters for tracking
 * @param {object} params.featureToggles - Feature toggles from Redux state
 * @param {string} params.pathname - Current page pathname (first form page)
 */
export const trackFormStarted = ({ featureToggles, pathname }) => {
  const properties = {
    formId: VA_FORM_IDS.FORM_21_526EZ,
    sourcePath: pathname,
  };

  // Add sidenav feature toggle status
  if (featureToggles?.sidenav526ezEnabled !== undefined) {
    properties.sidenav526ezEnabled = featureToggles.sidenav526ezEnabled;
  }

  // Track if side nav component is actually rendered on page (accounts for gradual rollout)
  properties.sidenavIsActive = !!document.getElementById(SIDENAV_COMPONENT_ID);

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
 * @param {string} params.returnUrl - URL where user is being redirected
 */
export const trackFormResumption = ({ featureToggles, returnUrl }) => {
  const properties = {
    formId: VA_FORM_IDS.FORM_21_526EZ,
    returnUrl,
  };

  // Add sidenav feature toggle status
  if (featureToggles?.sidenav526ezEnabled !== undefined) {
    properties.sidenav526ezEnabled = featureToggles.sidenav526ezEnabled;
  }

  // Track if side nav component is actually rendered on page (accounts for gradual rollout)
  properties.sidenavIsActive = !!document.getElementById(SIDENAV_COMPONENT_ID);

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
 * Tracks form submission attempts
 * This tracks when the user clicks the submit button on the 526EZ form
 *
 * @param {object} params - Parameters for tracking
 * @param {object} params.featureToggles - Feature toggles from Redux state
 * @param {string} params.pathname - Current page pathname (review/submit page)
 */
export const trackFormSubmitted = ({ featureToggles, pathname }) => {
  const properties = {
    formId: VA_FORM_IDS.FORM_21_526EZ,
  };

  // Add sidenav feature toggle status
  if (featureToggles?.sidenav526ezEnabled !== undefined) {
    properties.sidenav526ezEnabled = featureToggles.sidenav526ezEnabled;
  }

  // Track if side nav component is actually rendered on page (accounts for gradual rollout)
  properties.sidenavIsActive = !!document.getElementById(SIDENAV_COMPONENT_ID);

  properties.sourcePath = pathname;

  trackAction('Form submission - Submit button clicked', properties);
};

/**
 * Tracks mobile sidenav accordion expand/collapse
 * This tracks when users interact with the mobile accordion to show/hide navigation
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

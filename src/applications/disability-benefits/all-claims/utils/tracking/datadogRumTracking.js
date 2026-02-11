import { VA_FORM_IDS } from '@department-of-veterans-affairs/platform-forms/constants';
import { datadogRum } from '@datadog/browser-rum';
import {
  TRACKING_526EZ_SIDENAV_BACK_BUTTON_CLICKS,
  TRACKING_526EZ_SIDENAV_CONTINUE_BUTTON_CLICKS,
  TRACKING_526EZ_SIDENAV_TOGGLE,
} from '../../constants';

/**
 * Reads common tracking defaults from sessionStorage and the browser.
 * Centralizes the two values every tracking function needs:
 * - sidenav526ezEnabled: written once by Form526EZApp on mount
 * - sourcePath: current window pathname
 *
 * @returns {{ sourcePath: string, sidenav526ezEnabled: boolean|undefined }}
 */
const getTrackingDefaults = () => {
  const raw = sessionStorage.getItem(TRACKING_526EZ_SIDENAV_TOGGLE);
  return {
    sourcePath: window.location.pathname,
    sidenav526ezEnabled: raw !== null ? raw === 'true' : undefined,
  };
};

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
  } catch (error) {
    // Silent fail - tracking should never break the form
    // eslint-disable-next-line no-console
    console.error('[DataDog Tracking Error]', error);
  }
};

/**
 * Tracks back button clicks in the 526EZ form
 * Maintains a session-based click counter and reads tracking defaults
 * from sessionStorage / window.location for DataDog RUM tracking
 */
export const trackBackButtonClick = () => {
  const { sourcePath, sidenav526ezEnabled } = getTrackingDefaults();

  const currentCount = parseInt(
    sessionStorage.getItem(TRACKING_526EZ_SIDENAV_BACK_BUTTON_CLICKS) || '0',
    10,
  );
  const newCount = currentCount + 1;
  sessionStorage.setItem(
    TRACKING_526EZ_SIDENAV_BACK_BUTTON_CLICKS,
    newCount.toString(),
  );

  const properties = {
    formId: VA_FORM_IDS.FORM_21_526EZ,
    sourcePath,
    clickCount: newCount,
  };

  if (sidenav526ezEnabled !== undefined) {
    properties.sidenav526ezEnabled = sidenav526ezEnabled;
  }

  trackAction('Form navigation - Back button clicked', properties);
};

/**
 * Tracks "Finish this application later" link clicks
 * Reads tracking defaults from sessionStorage / window.location
 */
export const trackSaveFormClick = () => {
  const { sourcePath, sidenav526ezEnabled } = getTrackingDefaults();

  const properties = {
    formId: VA_FORM_IDS.FORM_21_526EZ,
    sourcePath,
  };

  if (sidenav526ezEnabled !== undefined) {
    properties.sidenav526ezEnabled = sidenav526ezEnabled;
  }

  trackAction(
    'Form save in progress - Finish this application later clicked',
    properties,
  );
};

/**
 * Tracks continue button clicks in the 526EZ form
 * Maintains a session-based click counter and reads tracking defaults
 * from sessionStorage / window.location for DataDog RUM tracking
 */
export const trackContinueButtonClick = () => {
  const { sourcePath, sidenav526ezEnabled } = getTrackingDefaults();

  const currentCount = parseInt(
    sessionStorage.getItem(TRACKING_526EZ_SIDENAV_CONTINUE_BUTTON_CLICKS) ||
      '0',
    10,
  );
  const newCount = currentCount + 1;
  sessionStorage.setItem(
    TRACKING_526EZ_SIDENAV_CONTINUE_BUTTON_CLICKS,
    newCount.toString(),
  );

  const properties = {
    formId: VA_FORM_IDS.FORM_21_526EZ,
    sourcePath,
    clickCount: newCount,
  };

  if (sidenav526ezEnabled !== undefined) {
    properties.sidenav526ezEnabled = sidenav526ezEnabled;
  }

  trackAction('Form navigation - Continue button clicked', properties);
};

/**
 * Tracks when user starts the form from introduction page
 * This tracks the initial form start event (not resumption)
 */
export const trackFormStarted = () => {
  const { sourcePath, sidenav526ezEnabled } = getTrackingDefaults();

  const properties = {
    formId: VA_FORM_IDS.FORM_21_526EZ,
    sourcePath,
  };

  if (sidenav526ezEnabled !== undefined) {
    properties.sidenav526ezEnabled = sidenav526ezEnabled;
  }

  trackAction(
    'Form started - User began form from introduction page',
    properties,
  );
};

/**
 * Tracks when user resumes a saved form
 * This tracks form resumption (not initial start)
 */
export const trackFormResumption = () => {
  const { sidenav526ezEnabled } = getTrackingDefaults();

  const properties = {
    formId: VA_FORM_IDS.FORM_21_526EZ,
    returnUrl: window.location.pathname,
  };

  if (sidenav526ezEnabled !== undefined) {
    properties.sidenav526ezEnabled = sidenav526ezEnabled;
  }

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
 */
export const trackFormSubmitted = () => {
  const { sourcePath, sidenav526ezEnabled } = getTrackingDefaults();

  const properties = {
    formId: VA_FORM_IDS.FORM_21_526EZ,
    sourcePath,
  };

  if (sidenav526ezEnabled !== undefined) {
    properties.sidenav526ezEnabled = sidenav526ezEnabled;
  }

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

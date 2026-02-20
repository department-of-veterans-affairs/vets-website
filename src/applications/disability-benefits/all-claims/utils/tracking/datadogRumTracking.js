import { VA_FORM_IDS } from '@department-of-veterans-affairs/platform-forms/constants';
import { datadogRum } from '@datadog/browser-rum';
import {
  TRACKING_526EZ_SIDENAV_BACK_BUTTON_CLICKS,
  TRACKING_526EZ_SIDENAV_CONTINUE_BUTTON_CLICKS,
  TRACKING_526EZ_SIDENAV_FEATURE_TOGGLE,
  TRACKING_526EZ_SIDENAV_CLICKS,
} from '../../constants';

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
  }
};

/**
 * Increments a click counter in sessionStorage
 * Returns the new count value, defaulting to 1 if storage is blocked
 *
 * @param {string} storageKey - The sessionStorage key to increment
 * @returns {number} The new click count
 */
const incrementClickCounter = storageKey => {
  let count = 1;
  try {
    const parsedCount = parseInt(
      sessionStorage.getItem(storageKey) || '0',
      10,
    );
    const safeCurrentCount = Number.isFinite(parsedCount) ? parsedCount : 0;
    count = safeCurrentCount + 1;
    sessionStorage.setItem(storageKey, count.toString());
  } catch (error) {
    // Storage access blocked - continue with default count
  }
  return count;
};

/**
 * Reads common tracking defaults from sessionStorage and the browser.
 * Centralizes the two values every tracking function needs:
 * - sidenav526ezEnabled: written once by Form526EZApp on mount
 * - sourcePath: current window pathname
 *
 * @returns {{ sourcePath: string, sidenav526ezEnabled: boolean|undefined }}
 */
const getSideNavTrackingDefaults = () => {
  let sidenav526ezEnabled;

  try {
    const raw = sessionStorage.getItem(TRACKING_526EZ_SIDENAV_FEATURE_TOGGLE);
    sidenav526ezEnabled = raw !== null ? raw === 'true' : undefined;
  } catch (error) {
    // Storage access blocked (privacy mode, CSP, etc.)
    sidenav526ezEnabled = undefined;
  }

  return {
    sourcePath: window.location.pathname,
    sidenav526ezEnabled,
  };
};

/**
 * Tracks back button clicks in the 526EZ form
 * Maintains a session-based click counter and reads tracking defaults
 * from sessionStorage / window.location for DataDog RUM tracking
 */
export const trackBackButtonClick = () => {
  try {
    const { sourcePath, sidenav526ezEnabled } = getSideNavTrackingDefaults();
    const newCount = incrementClickCounter(
      TRACKING_526EZ_SIDENAV_BACK_BUTTON_CLICKS,
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
  } catch (error) {
    // Silent fail - tracking should never break the form
  }
};

/**
 * Tracks continue button clicks in the 526EZ form
 * Maintains a session-based click counter and reads tracking defaults
 * from sessionStorage / window.location for DataDog RUM tracking
 */
export const trackContinueButtonClick = () => {
  try {
    const { sourcePath, sidenav526ezEnabled } = getSideNavTrackingDefaults();
    const newCount = incrementClickCounter(
      TRACKING_526EZ_SIDENAV_CONTINUE_BUTTON_CLICKS,
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
  } catch (error) {
    // Silent fail - tracking should never break the form
  }
};

/**
 * Tracks when user starts the form from introduction page
 * This tracks the initial form start event (not resumption)
 */
export const trackFormStarted = () => {
  try {
    const { sourcePath, sidenav526ezEnabled } = getSideNavTrackingDefaults();

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
  } catch (error) {
    // Silent fail - tracking should never break the form
  }
};

/**
 * Tracks when user resumes a saved form
 * This tracks form resumption (not initial start)
 */
export const trackFormResumption = () => {
  try {
    const { sidenav526ezEnabled } = getSideNavTrackingDefaults();

    const properties = {
      formId: VA_FORM_IDS.FORM_21_526EZ,
      returnUrl: window.location.pathname,
    };

    if (sidenav526ezEnabled !== undefined) {
      properties.sidenav526ezEnabled = sidenav526ezEnabled;
    }

    trackAction('Form resumption - Saved form loaded', properties);
  } catch (error) {
    // Silent fail - tracking should never break the form
  }
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
  try {
    const clickCount = incrementClickCounter(TRACKING_526EZ_SIDENAV_CLICKS);

    const properties = {
      formId: VA_FORM_IDS.FORM_21_526EZ,
      chapterTitle: pageData.label,
      sourcePath: pathname,
      sideNavClickCount: clickCount,
    };

    trackAction('Side navigation - Chapter clicked', properties);
  } catch (error) {
    // Silent fail - tracking should never break the form
  }
};

/**
 * Tracks form submission attempts
 * This tracks when the user clicks the submit button on the 526EZ form
 */
export const trackFormSubmitted = () => {
  try {
    const { sourcePath, sidenav526ezEnabled } = getSideNavTrackingDefaults();

    const properties = {
      formId: VA_FORM_IDS.FORM_21_526EZ,
      sourcePath,
    };

    if (sidenav526ezEnabled !== undefined) {
      properties.sidenav526ezEnabled = sidenav526ezEnabled;
    }

    trackAction('Form submission - Submit button clicked', properties);
  } catch (error) {
    // Silent fail - tracking should never break the form
  }
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
  try {
    const clickCount = incrementClickCounter(TRACKING_526EZ_SIDENAV_CLICKS);

    const properties = {
      formId: VA_FORM_IDS.FORM_21_526EZ,
      state,
      accordionTitle,
      sourcePath: pathname,
      sideNavClickCount: clickCount,
    };

    trackAction('Side navigation - Mobile accordion clicked', properties);
  } catch (error) {
    // Silent fail - tracking should never break the form
  }
};

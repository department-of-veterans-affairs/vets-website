import environment from '@department-of-veterans-affairs/platform-utilities/environment';

/**
 * Use this module in a validation function to determine if validation
 * was triggered by user attempting to navigate form page
 */
const navigationState = {
  _navigationEvent: false,
  _currentPath: null,

  setNavigationEvent() {
    this._navigationEvent = true;
    this._currentPath = window.location.href;

    setTimeout(() => {
      this._navigationEvent = false;
      this._currentPath = null;
    }, 0);
  },

  getNavigationEventStatus() {
    /**
     * in CI checking path equality sometimes causes problems
     * the path check is relevant only to file input / multiple file input / international telephone
     * in which navigation status is checked on initial page load validation
     */
    if (environment.isTest() && !environment.isUnitTest()) {
      return this._navigationEvent;
    }
    // only return true if the navigation happened on the current page
    return this._navigationEvent && this._currentPath === window.location.href;
  },
};

export default navigationState;

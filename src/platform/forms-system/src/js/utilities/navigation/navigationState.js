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
    // only return true if the navigation happened on the current page
    return this._navigationEvent && this._currentPath === window.location.href;
  },
};

export default navigationState;

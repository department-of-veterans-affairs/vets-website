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
    // eslint-disable-next-line no-console
    console.log('SET navigation path:', this._currentPath);

    setTimeout(() => {
      this._navigationEvent = false;
      this._currentPath = null;
      // eslint-disable-next-line no-console
      console.log('CLEARED navigation state');
    }, 0);
  },

  getNavigationEventStatus() {
    // eslint-disable-next-line no-console
    console.log('CHECK navigation:', {
      navigationEvent: this._navigationEvent,
      storedPath: this._currentPath,
      currentPath: window.location.href,
      match:
        this._navigationEvent && this._currentPath === window.location.href,
    });
    // only return true if the navigation happened on the current page
    return this._navigationEvent && this._currentPath === window.location.href;
  },
};

export default navigationState;

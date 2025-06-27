/**
 * Use this module in a validation function to determine if validation
 * was triggered by user attempting to navigate form page
 */
const navigationState = {
  _navigationEvent: false,

  setNavigationEvent() {
    this._navigationEvent = true;

    setTimeout(() => {
      this._navigationEvent = false;
    }, 0);
  },

  getNavigationEventStatus() {
    return this._navigationEvent;
  },
};

export default navigationState;

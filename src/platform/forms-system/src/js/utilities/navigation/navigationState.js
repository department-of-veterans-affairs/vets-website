/* eslint-disable no-console */
// import environment from '@department-of-veterans-affairs/platform-utilities/environment';
const instanceId = Math.random()
  .toString(36)
  .substring(7);
console.log(`NavigationState instance created: ${instanceId}`);

/**
 * Use this module in a validation function to determine if validation
 * was triggered by user attempting to navigate form page
 */
const navigationState = {
  instanceId,
  _navigationEvent: false,
  _currentPath: null,

  setNavigationEvent() {
    try {
      console.log(`setNavigationEvent called on instance: ${this.instanceId}`);
      this._navigationEvent = true;
      this._currentPath = window.location.href;

      setTimeout(() => {
        this._navigationEvent = false;
        this._currentPath = null;
      }, 0);
    } catch (error) {
      console.log('ERROR from setNavigationEvent!:', error);
    }
  },

  getNavigationEventStatus() {
    /**
     * in CI checking path equality sometimes causes problems
     * the path check is relevant only to file input / multiple file input / international telephone
     * in which navigation status is checked on initial page load validation
     */
    // if (environment.isTest() && !environment.isUnitTest()) {
    //   return this._navigationEvent;
    // }
    // only return true if the navigation happened on the current page
    // eslint-disable-next-line no-console
    try {
      console.log(
        `getNavigationEventStatus called on instance: ${this.instanceId}`,
      );
      console.log(
        'the status is\n',
        this._navigationEvent,
        'and the current path is\n',
        this._currentPath,
        'and the window.location.href is\n',
        window.location.href,
        '\n',
        Date.now(),
      );
      return (
        this._navigationEvent && this._currentPath === window.location.href
      );
    } catch (error) {
      console.log('ERROR from getNavigationStatus!!!', error);
      return null;
    }
  },
};

export default navigationState;

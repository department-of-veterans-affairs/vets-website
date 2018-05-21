/**
 * Simple data structure that abstracts away add/removing dismissed flags in the session.
 * The Downtime Approaching warning should only be shown once, so we store that flag in the session.
 * We store it using the appTitle (which should be unique to the app) in an array so that other apps
 * that may be experiencing downtime will still have the warning.
 */
const dismissedDowntimeNotifications = {
  key: 'downtime-notifications-dismissed',
  setup() {
    const rawData = window.sessionStorage[this.key];
    this._dismissedDowntimeNotifications = rawData ? JSON.parse(rawData) : [];
  },
  contains(appTitle) {
    return this._dismissedDowntimeNotifications.some(_appTitle => _appTitle === appTitle);
  },
  push(appTitle) {
    this._dismissedDowntimeNotifications.push(appTitle);
    window.sessionStorage[this.key] = JSON.stringify(this._dismissedDowntimeNotifications);
  }
};

export default dismissedDowntimeNotifications;

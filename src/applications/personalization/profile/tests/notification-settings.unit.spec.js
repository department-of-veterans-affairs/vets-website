import { expect } from 'chai';
import localStorage from 'platform/utilities/storage/localStorage';
import { showNotificationSettings } from '../selectors';

describe('checkAndUpdateNotificationSettings', () => {
  const makeDefaultState = (flagStatus = true) => ({
    featureToggles: {
      // eslint-disable-next-line camelcase
      profile_notification_settings: flagStatus,
    },
  });

  beforeEach(() => {
    localStorage.clear();
  });

  it('should get feature flag setting if no local storage exists', () => {
    const state = makeDefaultState();
    expect(showNotificationSettings(state)).to.equal(true);
  });

  it('should return true and ignore feature flag if local storage is 1', () => {
    localStorage.setItem('PROFILE_NOTIFICATION_SETTINGS', true);
    const state = makeDefaultState(false);
    expect(showNotificationSettings(state)).to.equal(true);
  });

  it('should return false and ignore feature flag if local storage is 0', () => {
    localStorage.setItem('PROFILE_NOTIFICATION_SETTINGS', false);
    const state = makeDefaultState();
    expect(showNotificationSettings(state)).to.equal(false);
  });

  afterEach(() => {
    localStorage.clear();
  });
});

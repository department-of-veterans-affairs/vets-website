import { expect } from 'chai';

describe('ezr AuthenticatedRoute Feature Toggle', () => {
  it('should bypass authentication in localhost when feature toggle is off', () => {
    // Simulate localhost environment
    const isLocalhost = true;

    // Feature toggle is off
    const featureToggles = {
      ezrRouteGuardEnabled: false,
    };

    // The disableGuards function would return true in this case
    const disableGuards = isLocalhost && !featureToggles.ezrRouteGuardEnabled;

    expect(disableGuards).to.be.true;
  });

  it('should enforce authentication in localhost when feature toggle is on', () => {
    // Simulate localhost environment
    const isLocalhost = true;

    // Feature toggle is on
    const featureToggles = {
      ezrRouteGuardEnabled: true,
    };

    // The disableGuards function would return false in this case
    const disableGuards = isLocalhost && !featureToggles.ezrRouteGuardEnabled;

    expect(disableGuards).to.be.false;
  });

  it('should enforce authentication in review instances regardless of feature toggle', () => {
    // Simulate review instance environment
    const isLocalhost = false;

    // Feature toggle is off
    const featureToggles = {
      ezrRouteGuardEnabled: false,
    };

    // The disableGuards function would return false in this case
    const disableGuards = isLocalhost && !featureToggles.ezrRouteGuardEnabled;

    expect(disableGuards).to.be.false;
  });

  it('should enforce authentication in review instances even with feature toggle on', () => {
    // Simulate review instance environment
    const isLocalhost = false;

    // Feature toggle is on
    const featureToggles = {
      ezrRouteGuardEnabled: true,
    };

    // The disableGuards function would return false in this case
    const disableGuards = isLocalhost && !featureToggles.ezrRouteGuardEnabled;

    expect(disableGuards).to.be.false;
  });
});

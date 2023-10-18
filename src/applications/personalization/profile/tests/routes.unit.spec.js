import { expect } from 'chai';

import getRoutes from '@@profile/routes';
import { getRoutesForNav, routesForNav } from '@@profile/routesForNav';
import { PROFILE_PATH_NAMES } from '@@profile/constants.js';

describe('getRoutes', () => {
  describe('when called should always include direct deposit path', () => {
    it('should return the direct deposit path`', () => {
      const allRoutes = getRoutes();
      const hasDirectDepositRoute = allRoutes.some(
        route => route.name === PROFILE_PATH_NAMES.DIRECT_DEPOSIT,
      );

      expect(hasDirectDepositRoute).to.be.true;
    });
  });
});

describe('getRoutesForNav', () => {
  it('enables contacts route when true', () => {
    const phccRoute = routesForNav.find(
      route => route.name === PROFILE_PATH_NAMES.CONTACTS,
    );
    expect(phccRoute).to.exist;
    const routes = getRoutesForNav(true);
    expect(routes).to.include(phccRoute);
  });

  it('disables contacts route when false', () => {
    const phccRoute = routesForNav.find(
      route => route.name === PROFILE_PATH_NAMES.CONTACTS,
    );
    expect(phccRoute).to.exist;
    const routes = getRoutesForNav(false);
    expect(routes).to.not.include(phccRoute);
  });
});

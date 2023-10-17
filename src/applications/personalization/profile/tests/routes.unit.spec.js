import { expect } from 'chai';

import getRoutes from '@@profile/routes.js';
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

  it('returns an array of route objects', () => {
    const routes = getRoutes();
    expect(routes).to.be.an('array');
    expect(routes.length >= 7).to.be.true;
    expect(routes[0].name).to.eq(PROFILE_PATH_NAMES.PERSONAL_INFORMATION);
  });

  it('adds the edit route when feature toggle is true', () => {
    const routes = getRoutes({ useFieldEditingPage: true });
    const result = routes.some(route => route.name === PROFILE_PATH_NAMES.EDIT);
    expect(result).to.be.true;
  });

  it('removes the edit route when feature toggle is false', () => {
    const routes = getRoutes({ useFieldEditingPage: false });
    const result = routes.some(route => route.name === PROFILE_PATH_NAMES.EDIT);
    expect(result).to.be.false;
  });
});

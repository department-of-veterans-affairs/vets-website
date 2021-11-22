import { expect } from 'chai';

import getRoutes from '@@profile/routes.js';
import { PROFILE_PATH_NAMES } from '@@profile/constants.js';

describe('getRoutes', () => {
  describe('when options.removeDirectDeposit is false', () => {
    it('should return the direct deposit path`', () => {
      const allRoutes = getRoutes({ removeDirectDeposit: false });
      const hasDirectDepositRoute = allRoutes.some(
        route => route.name === PROFILE_PATH_NAMES.DIRECT_DEPOSIT,
      );

      expect(hasDirectDepositRoute).to.be.true;
    });
  });

  describe('when options.removeDirectDeposit is true', () => {
    it('should not return the direct deposit path', () => {
      const allRoutes = getRoutes({ removeDirectDeposit: true });
      const hasDirectDepositRoute = allRoutes.some(
        route => route.name === PROFILE_PATH_NAMES.DIRECT_DEPOSIT,
      );

      expect(hasDirectDepositRoute).to.be.false;
    });
  });
});

import { expect } from 'chai';

import getRoutes from 'applications/personalization/profile/routes.js';
import { PROFILE_PATH_NAMES } from 'applications/personalization/profile/constants.js';

describe('getRoutes', () => {
  describe('when options.removeDirectDeposit is false', () => {
    it('should return all possible PROFILE_PATHS`', () => {
      const allRoutes = getRoutes({ removeDirectDeposit: false });
      const hasDirectDepositRoute = allRoutes.some(
        route => route.name === PROFILE_PATH_NAMES.DIRECT_DEPOSIT,
      );

      expect(hasDirectDepositRoute).to.be.true;
    });
  });

  describe('when options.removeDirectDeposit is true', () => {
    it('should return all possible PROFILE_PATHS except for the Direct Deposit route', () => {
      const allRoutes = getRoutes({ removeDirectDeposit: true });
      const hasDirectDepositRoute = allRoutes.some(
        route => route.name === PROFILE_PATH_NAMES.DIRECT_DEPOSIT,
      );

      expect(hasDirectDepositRoute).to.be.false;
    });
  });
});

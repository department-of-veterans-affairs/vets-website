import { expect } from 'chai';

import getRoutes from '@@profile/routes';
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

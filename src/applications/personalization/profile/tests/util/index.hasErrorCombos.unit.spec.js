import { expect } from 'chai';

import mockDisabilityCompensations from '@@profile/mocks/endpoints/disability-compensations';
import { LIGHTHOUSE_ERROR_KEYS, hasErrorCombos } from '../../util';

describe('hasErrorCombos', () => {
  context('cases for invalid routing number', () => {
    it('return true for routing number error', () => {
      expect(
        hasErrorCombos({
          errors:
            mockDisabilityCompensations.updates.errors.invalidRoutingNumber
              .errors,
          errorKeys: [LIGHTHOUSE_ERROR_KEYS.ROUTING_NUMBER_INVALID],
        }),
      ).to.be.true;
    });
  });

  context('cases for phone number errors', () => {
    it('return true for Lighthouse day phone error', () => {
      expect(
        hasErrorCombos({
          errors:
            mockDisabilityCompensations.updates.errors.invalidDayPhone.errors,
          errorKeys: [LIGHTHOUSE_ERROR_KEYS.DAY_PHONE_NUMBER_INVALID],
        }),
      ).to.be.true;
    });

    it('return true for Lighthouse day area error', () => {
      expect(
        hasErrorCombos({
          errors:
            mockDisabilityCompensations.updates.errors.invalidDayPhoneArea
              .errors,
          errorKeys: [LIGHTHOUSE_ERROR_KEYS.DAY_PHONE_AREA_INVALID],
        }),
      ).to.be.true;
    });
  });
});

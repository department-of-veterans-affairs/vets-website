import { expect } from 'chai';

import mockDirectDeposits from '@@profile/mocks/endpoints/direct-deposits';
import { DIRECT_DEPOSIT_ERROR_KEYS, hasErrorCombos } from '../../util';

describe('hasErrorCombos', () => {
  context('cases for invalid routing number', () => {
    it('return true for routing number error', () => {
      expect(
        hasErrorCombos({
          errors: mockDirectDeposits.updates.errors.invalidRoutingNumber.errors,
          errorKeys: [DIRECT_DEPOSIT_ERROR_KEYS.ROUTING_NUMBER_INVALID],
        }),
      ).to.be.true;
    });
  });

  context('cases for phone number errors', () => {
    it('return true for Lighthouse day phone error', () => {
      expect(
        hasErrorCombos({
          errors: mockDirectDeposits.updates.errors.invalidDayPhone.errors,
          errorKeys: [DIRECT_DEPOSIT_ERROR_KEYS.DAY_PHONE_NUMBER_INVALID],
        }),
      ).to.be.true;
    });

    it('return true for Lighthouse day phone area error', () => {
      expect(
        hasErrorCombos({
          errors: mockDirectDeposits.updates.errors.invalidDayPhoneArea.errors,
          errorKeys: [DIRECT_DEPOSIT_ERROR_KEYS.DAY_PHONE_AREA_INVALID],
        }),
      ).to.be.true;
    });
  });
});

import { expect } from 'chai';

import mockDisabilityCompensations from '@@profile/mocks/endpoints/disability-compensations';
import {
  LIGHTHOUSE_ERROR_KEYS,
  PPIU_ERROR_MAP,
  hasErrorCombos,
} from '../../util';

const dayPhoneErrorNumberInvalidPPIU = [
  {
    title: 'Unprocessable Entity',
    detail: 'One or more unprocessable user payment properties',
    code: '126',
    source: 'EVSS::PPIU::Service',
    status: '422',
    meta: {
      messages: [
        {
          key: 'cnp.payment.generic.error.message',
          severity: 'ERROR',
          text:
            'Generic CnP payment update error. Update response: Update Failed: Day phone number is invalid, must be 7 digits',
        },
      ],
    },
  },
];

const dayPhoneErrorAreaInvalidPPIU = [
  {
    title: 'Unprocessable Entity',
    detail: 'One or more unprocessable user payment properties',
    code: '126',
    source: 'EVSS::PPIU::Service',
    status: '422',
    meta: {
      messages: [
        {
          key: 'cnp.payment.generic.error.message',
          severity: 'ERROR',
          text:
            'Generic CnP payment update error. Update response: Update Failed: Day area number is invalid, must be 3 digits',
        },
      ],
    },
  },
];

describe('hasErrorCombos', () => {
  context('cases for invalid routing number', () => {
    it('return true for PPIU routing number error', () => {
      expect(
        hasErrorCombos({
          errors:
            mockDisabilityCompensations.updates.errors.invalidRoutingNumber
              .errors,
          errorKeys: [
            PPIU_ERROR_MAP.INVALID_ROUTING_NUMBER.RESPONSE_KEY,
            LIGHTHOUSE_ERROR_KEYS.ROUTING_NUMBER_INVALID,
          ],
        }),
      ).to.be.true;
    });
  });

  context('cases for phone number errors', () => {
    it('return true for PPIU day phone number error', () => {
      expect(
        hasErrorCombos({
          errors: dayPhoneErrorNumberInvalidPPIU,
          errorKeys: [PPIU_ERROR_MAP.GENERIC_ERROR.RESPONSE_KEY],
          errorTexts: ['day phone'],
        }),
      ).to.be.true;
    });

    context('return true for PPIU day phone area error', () => {
      expect(
        hasErrorCombos({
          errors: dayPhoneErrorAreaInvalidPPIU,
          errorKeys: [PPIU_ERROR_MAP.GENERIC_ERROR.RESPONSE_KEY],
          errorTexts: ['day area'],
        }),
      ).to.be.true;
    });

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

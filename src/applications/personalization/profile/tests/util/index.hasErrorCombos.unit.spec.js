import { expect } from 'chai';

import mockDisabilityCompensation from '@@profile/mocks/endpoints/disability-compensations';
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

const testDayPhone = errors => {
  return hasErrorCombos({
    errors,
    errorKeys: [
      PPIU_ERROR_MAP.GENERIC_ERROR.RESPONSE_KEY,
      LIGHTHOUSE_ERROR_KEYS.GENERIC_ERROR,
      LIGHTHOUSE_ERROR_KEYS.UNSPECIFIED_ERROR,
    ],
    errorTexts: ['day area', 'day phone number'],
  });
};

describe('hasErrorCombos', () => {
  context('cases for invalid routing number', () => {
    it('return true for PPIU routing number error', () => {
      expect(
        hasErrorCombos({
          errors:
            mockDisabilityCompensation.updates.errors.invalidRoutingNumber
              .errors,
          errorKeys: [
            PPIU_ERROR_MAP.INVALID_ROUTING_NUMBER.RESPONSE_KEY,
            LIGHTHOUSE_ERROR_KEYS.ROUTING_NUMBER_INVALID,
          ],
        }),
      ).to.be.true;
    });
  });

  context('cases for Day Phone number errors', () => {
    it('return true for PPIU day phone number error', () => {
      expect(testDayPhone(dayPhoneErrorNumberInvalidPPIU)).to.be.true;
    });

    context('return true for PPIU day phone area error', () => {
      expect(testDayPhone(dayPhoneErrorAreaInvalidPPIU)).to.be.true;
    });

    it('return true for Lighthouse day phone error', () => {
      expect(
        testDayPhone(
          mockDisabilityCompensation.updates.errors.invalidDayPhone.errors,
        ),
      ).to.be.true;
    });

    it('return true for Lighthouse day area error', () => {
      expect(
        testDayPhone(
          mockDisabilityCompensation.updates.errors.invalidDayArea.errors,
        ),
      ).to.be.true;
    });

    it('return true for Lighthouse day phone with general error code', () => {
      expect(
        testDayPhone(
          mockDisabilityCompensation.updates.errors.invalidDayPhoneGeneral
            .errors,
        ),
      ).to.be.true;
    });

    it('return true for Lighthouse day area with general error code', () => {
      expect(
        testDayPhone(
          mockDisabilityCompensation.updates.errors.invalidDayAreaGeneral
            .errors,
        ),
      ).to.be.true;
    });

    it('return false for plain unspecified error', () => {
      expect(
        testDayPhone(
          mockDisabilityCompensation.updates.errors.unspecified.errors,
        ),
      ).to.be.false;
    });
  });
});

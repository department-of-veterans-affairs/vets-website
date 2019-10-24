import { expect } from 'chai';

import { createDirectDepositAnalyticsDataObject } from '../../util';

describe('profile utils', () => {
  const defaultDataObject = {
    event: 'profile-edit-failure',
    'profile-action': 'save-failure',
    'profile-section': 'direct-deposit-information',
    'error-key': 'other-error',
  };
  const badAddressDataObject = {
    event: 'profile-edit-failure',
    'profile-action': 'save-failure',
    'profile-section': 'direct-deposit-information',
    'error-key': 'mailing-address-error',
  };
  const badHomePhoneDataObject = {
    event: 'profile-edit-failure',
    'profile-action': 'save-failure',
    'profile-section': 'direct-deposit-information',
    'error-key': 'home-phone-error',
  };
  const badWorkPhoneDataObject = {
    event: 'profile-edit-failure',
    'profile-action': 'save-failure',
    'profile-section': 'direct-deposit-information',
    'error-key': 'work-phone-error',
  };
  describe('createEventDataObjectWithErrors', () => {
    it('returns the correct data when passed nothing', () => {
      const eventDataObject = createDirectDepositAnalyticsDataObject();
      expect(eventDataObject).to.deep.equal(defaultDataObject);
    });
    it('returns the correct data when passed nothing', () => {
      const eventDataObject = createDirectDepositAnalyticsDataObject([]);
      expect(eventDataObject).to.deep.equal(defaultDataObject);
    });
    it('returns the correct data when a bad address error is passed', () => {
      const eventDataObject = createDirectDepositAnalyticsDataObject([
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
                  'Generic CnP payment update error. Update response: Update Failed: Required field not entered for mailing address update',
              },
            ],
          },
        },
      ]);
      expect(eventDataObject).to.deep.equal(badAddressDataObject);
    });
    it('returns the correct data when a work phone number error is passed', () => {
      const eventDataObject = createDirectDepositAnalyticsDataObject([
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
      ]);
      expect(eventDataObject).to.deep.equal(badWorkPhoneDataObject);
    });
    it('returns the correct data when a day phone number error is passed', () => {
      const eventDataObject = createDirectDepositAnalyticsDataObject([
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
                  'Generic CnP payment update error. Update response: Update Failed: Night area number is invalid, must be 3 digits',
              },
            ],
          },
        },
      ]);
      expect(eventDataObject).to.deep.equal(badHomePhoneDataObject);
    });
  });
});

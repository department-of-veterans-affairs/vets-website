import { expect } from 'chai';

import mockDisabilityCompensations from '@@profile/mocks/endpoints/disability-compensations';

import {
  createCNPDirectDepositAnalyticsDataObject,
  hasAccountFlaggedError,
  hasRoutingNumberFlaggedError,
  hasInvalidHomePhoneNumberError,
} from '../../util';

describe('profile utils', () => {
  describe('createCNPDirectDepositAnalyticsDataObject', () => {
    const createEventDataObjectWithError = (
      errorKey,
      errorKeyDetail = 'Unspecified Error Detail',
    ) => ({
      event: 'profile-edit-failure',
      'profile-action': 'save-failure',
      'profile-section': 'cnp-direct-deposit-information',
      'error-key': `${errorKey} | ${errorKeyDetail || ''}-update`,
    });
    const defaultDataObject = createEventDataObjectWithError('other-error', '');
    const badAddressDataObject = createEventDataObjectWithError(
      'cnp.payment.mailing.address.invalid',
    );
    const badHomePhoneDataObject = createEventDataObjectWithError(
      'cnp.payment.night.phone.number.invalid',
    );
    const badWorkPhoneDataObject = createEventDataObjectWithError(
      'cnp.payment.day.phone.number.invalid',
    );
    const accountFlaggedForFraudDataObject = createEventDataObjectWithError(
      'cnp.payment.account.number.fraud',
    );
    const invalidRoutingNumberDataObject = createEventDataObjectWithError(
      'cnp.payment.routing.number.invalid',
    );
    const paymentRestrictionIndicatorsDataObject = createEventDataObjectWithError(
      'cnp.payment.restriction.indicators.present',
    );
    it('returns the correct data when passed nothing', () => {
      const eventDataObject = createCNPDirectDepositAnalyticsDataObject();
      expect(eventDataObject).to.deep.equal(defaultDataObject);
    });
    it('returns the correct data when passed an empty array', () => {
      const eventDataObject = createCNPDirectDepositAnalyticsDataObject([]);
      expect(eventDataObject).to.deep.equal(defaultDataObject);
    });
    // Wednesday, April 22, 2020 We saw errors in Sentry due to unsafe prop
    // drilling in our hasErrorMessage helper. This test was added to replicate
    // the error.
    // http://sentry.vfs.va.gov/vets-gov/website-production/issues/115880/
    it('returns the default error  event object when nothing is passed', () => {
      let eventDataObject = createCNPDirectDepositAnalyticsDataObject([{}]);
      expect(eventDataObject).to.deep.equal(defaultDataObject);
      eventDataObject = createCNPDirectDepositAnalyticsDataObject([
        {
          meta: {},
        },
      ]);
      expect(eventDataObject).to.deep.equal(defaultDataObject);
    });
    it('returns the correct data when a bad address error is passed', () => {
      const eventDataObject = createCNPDirectDepositAnalyticsDataObject({
        errors:
          mockDisabilityCompensations.updates.errors.invalidMailingAddress
            .errors,
      });
      expect(eventDataObject).to.deep.equal(badAddressDataObject);
    });
    it('returns the correct data when a work phone number error is passed', () => {
      const eventDataObject = createCNPDirectDepositAnalyticsDataObject(
        mockDisabilityCompensations.updates.errors.invalidDayPhone,
      );
      expect(eventDataObject).to.deep.equal(badWorkPhoneDataObject);
    });
    it('returns the correct data when a day phone number error is passed', () => {
      const eventDataObject = createCNPDirectDepositAnalyticsDataObject(
        mockDisabilityCompensations.updates.errors.invalidNightPhone,
      );
      expect(eventDataObject).to.deep.equal(badHomePhoneDataObject);
    });
    it('returns the correct data when an account flagged for fraud error is passed', () => {
      const eventDataObject = createCNPDirectDepositAnalyticsDataObject(
        mockDisabilityCompensations.updates.errors.accountNumberFlagged,
      );
      expect(eventDataObject).to.deep.equal(accountFlaggedForFraudDataObject);
    });
    it('returns the correct data when an invalid routing number error is passed', () => {
      const eventDataObject = createCNPDirectDepositAnalyticsDataObject(
        mockDisabilityCompensations.updates.errors.invalidRoutingNumber,
      );
      expect(eventDataObject).to.deep.equal(invalidRoutingNumberDataObject);
    });
    it('returns the correct data when an invalid routing number error is passed', () => {
      const eventDataObject = createCNPDirectDepositAnalyticsDataObject(
        mockDisabilityCompensations.updates.errors.invalidRoutingNumber,
      );
      expect(eventDataObject).to.deep.equal(invalidRoutingNumberDataObject);
    });
    it('returns the correct data when a payment restriction indicators error is passed', () => {
      const eventDataObject = createCNPDirectDepositAnalyticsDataObject(
        mockDisabilityCompensations.updates.errors.paymentRestrictionsPresent,
      );
      expect(eventDataObject).to.deep.equal(
        paymentRestrictionIndicatorsDataObject,
      );
    });
  });

  describe('PaymentInformation error parsing methods', () => {
    it('hasRoutingNumberFlaggedError returns true on error', () => {
      expect(
        hasRoutingNumberFlaggedError(
          mockDisabilityCompensations.updates.errors.routingNumberFlagged
            .errors,
        ),
      ).to.equal(true);
    });

    it('hasAccountFlaggedError returns true on error', () => {
      expect(
        hasAccountFlaggedError(
          mockDisabilityCompensations.updates.errors.accountNumberFlagged
            .errors,
        ),
      ).to.equal(true);
    });

    it('hasInvalidHomePhoneNumberError returns false if text does not contain night phone', () => {
      const { errors } = mockDisabilityCompensations.updates.errors.generic;
      expect(hasInvalidHomePhoneNumberError(errors)).to.not.be.ok;
    });

    it('should return false with multiple errors with text not matching desired error conditions', () => {
      const { errors } = mockDisabilityCompensations.updates.errors.generic;

      expect(
        !!hasInvalidHomePhoneNumberError([
          ...errors,
          ...mockDisabilityCompensations.updates.errors.invalidAccountNumber
            .errors,
        ]),
      ).to.be.not.ok;
    });
  });
});

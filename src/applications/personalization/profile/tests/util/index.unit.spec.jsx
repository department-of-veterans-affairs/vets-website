import { expect } from 'chai';

import mockDirectDeposits from '@@profile/mocks/endpoints/direct-deposits';

import {
  createDirectDepositAnalyticsDataObject,
  hasAccountFlaggedError,
  hasRoutingNumberFlaggedError,
  hasInvalidHomePhoneNumberError,
  getHealthCareSettingsHubDescription,
} from '../../util';

describe('profile utils', () => {
  describe('createDirectDepositAnalyticsDataObject', () => {
    const createEventDataObjectWithError = (
      errorKey,
      errorKeyDetail = 'Unspecified Error Detail',
    ) => ({
      event: 'profile-edit-failure',
      'profile-action': 'save-failure',
      'profile-section': 'direct-deposit-information',
      'error-key': `${errorKey} | ${errorKeyDetail || ''}-update`,
    });
    const defaultDataObject = createEventDataObjectWithError('other-error', '');
    const badAddressDataObject = createEventDataObjectWithError(
      'direct.deposit.mailing.address.invalid',
    );
    const badHomePhoneDataObject = createEventDataObjectWithError(
      'direct.deposit.night.phone.number.invalid',
    );
    const badWorkPhoneDataObject = createEventDataObjectWithError(
      'direct.deposit.day.phone.number.invalid',
    );
    const accountFlaggedForFraudDataObject = createEventDataObjectWithError(
      'direct.deposit.account.number.fraud',
    );
    const invalidRoutingNumberDataObject = createEventDataObjectWithError(
      'direct.deposit.routing.number.invalid',
    );
    const paymentRestrictionIndicatorsDataObject =
      createEventDataObjectWithError(
        'direct.deposit.restriction.indicators.present',
      );
    it('returns the correct data when passed nothing', () => {
      const eventDataObject = createDirectDepositAnalyticsDataObject();
      expect(eventDataObject).to.deep.equal(defaultDataObject);
    });
    it('returns the correct data when passed an empty array', () => {
      const eventDataObject = createDirectDepositAnalyticsDataObject([]);
      expect(eventDataObject).to.deep.equal(defaultDataObject);
    });
    // Wednesday, April 22, 2020 We saw errors in Sentry due to unsafe prop
    // drilling in our hasErrorMessage helper. This test was added to replicate
    // the error.
    // http://sentry.vfs.va.gov/vets-gov/website-production/issues/115880/
    it('returns the default error  event object when nothing is passed', () => {
      let eventDataObject = createDirectDepositAnalyticsDataObject([{}]);
      expect(eventDataObject).to.deep.equal(defaultDataObject);
      eventDataObject = createDirectDepositAnalyticsDataObject([
        {
          meta: {},
        },
      ]);
      expect(eventDataObject).to.deep.equal(defaultDataObject);
    });
    it('returns the correct data when a bad address error is passed', () => {
      const eventDataObject = createDirectDepositAnalyticsDataObject({
        errors: mockDirectDeposits.updates.errors.invalidMailingAddress.errors,
      });
      expect(eventDataObject).to.deep.equal(badAddressDataObject);
    });
    it('returns the correct data when a work phone number error is passed', () => {
      const eventDataObject = createDirectDepositAnalyticsDataObject(
        mockDirectDeposits.updates.errors.invalidDayPhone,
      );
      expect(eventDataObject).to.deep.equal(badWorkPhoneDataObject);
    });
    it('returns the correct data when a day phone number error is passed', () => {
      const eventDataObject = createDirectDepositAnalyticsDataObject(
        mockDirectDeposits.updates.errors.invalidNightPhone,
      );
      expect(eventDataObject).to.deep.equal(badHomePhoneDataObject);
    });
    it('returns the correct data when an account flagged for fraud error is passed', () => {
      const eventDataObject = createDirectDepositAnalyticsDataObject(
        mockDirectDeposits.updates.errors.accountNumberFlagged,
      );
      expect(eventDataObject).to.deep.equal(accountFlaggedForFraudDataObject);
    });
    it('returns the correct data when an invalid routing number error is passed', () => {
      const eventDataObject = createDirectDepositAnalyticsDataObject(
        mockDirectDeposits.updates.errors.invalidRoutingNumber,
      );
      expect(eventDataObject).to.deep.equal(invalidRoutingNumberDataObject);
    });
    it('returns the correct data when an invalid routing number error is passed', () => {
      const eventDataObject = createDirectDepositAnalyticsDataObject(
        mockDirectDeposits.updates.errors.invalidRoutingNumber,
      );
      expect(eventDataObject).to.deep.equal(invalidRoutingNumberDataObject);
    });
    it('returns the correct data when a payment restriction indicators error is passed', () => {
      const eventDataObject = createDirectDepositAnalyticsDataObject(
        mockDirectDeposits.updates.errors.paymentRestrictionsPresent,
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
          mockDirectDeposits.updates.errors.routingNumberFlagged.errors,
        ),
      ).to.equal(true);
    });

    it('hasAccountFlaggedError returns true on error', () => {
      expect(
        hasAccountFlaggedError(
          mockDirectDeposits.updates.errors.accountNumberFlagged.errors,
        ),
      ).to.equal(true);
    });

    it('hasInvalidHomePhoneNumberError returns false if text does not contain night phone', () => {
      const { errors } = mockDirectDeposits.updates.errors.generic;
      expect(hasInvalidHomePhoneNumberError(errors)).to.not.be.ok;
    });

    it('should return false with multiple errors with text not matching desired error conditions', () => {
      const { errors } = mockDirectDeposits.updates.errors.generic;

      expect(
        !!hasInvalidHomePhoneNumberError([
          ...errors,
          ...mockDirectDeposits.updates.errors.invalidAccountNumber.errors,
        ]),
      ).to.be.not.ok;
    });
  });

  describe('ProfileHub content for Health Care Settings', () => {
    it('returns correct description when both properties are true', () => {
      const description = getHealthCareSettingsHubDescription({
        hideHealthCareContacts: true,
        isSchedulingPreferencesPilotEligible: true,
      });
      expect(description).to.equal(
        'Messages signature and scheduling preferences',
      );
    });
    it('returns correct description when both properties are false', () => {
      const description = getHealthCareSettingsHubDescription({
        hideHealthCareContacts: false,
        isSchedulingPreferencesPilotEligible: false,
      });
      expect(description).to.equal(
        'Health care contacts and messages signature',
      );
    });
    it('returns correct description when just scheduling preferences is true', () => {
      const description = getHealthCareSettingsHubDescription({
        hideHealthCareContacts: false,
        isSchedulingPreferencesPilotEligible: true,
      });
      expect(description).to.equal(
        'Health care contacts, messages signature, and scheduling preferences',
      );
    });
    it('returns correct description when just health care contacts is true', () => {
      const description = getHealthCareSettingsHubDescription({
        hideHealthCareContacts: true,
        isSchedulingPreferencesPilotEligible: false,
      });
      expect(description).to.equal(
        'Messages signature and other health care settings',
      );
    });
  });
});

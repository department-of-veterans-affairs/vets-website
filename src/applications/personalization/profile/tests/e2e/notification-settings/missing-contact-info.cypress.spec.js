import dd4eduNotEnrolled from '@@profile/tests/fixtures/dd4edu/dd4edu-not-enrolled.json';
import disabilityRating from '@@profile/tests/fixtures/disability-rating-success.json';
import fullName from '@@profile/tests/fixtures/full-name-success.json';
import mockCommunicationPreferences from '@@profile/tests/fixtures/communication-preferences/get-200-maximal.json';
import { makeMockUser } from '@@profile/tests/fixtures/users/user';
import mockPaymentInfoNotEligible from '@@profile/tests/fixtures/dd4cnp/dd4cnp-is-not-eligible.json';
import personalInformation from '@@profile/tests/fixtures/personal-information-success.json';
import serviceHistory from '@@profile/tests/fixtures/service-history-success.json';

import { PROFILE_PATHS } from '@@profile/constants';

import { registerCypressHelpers } from '../helpers';

import mockFeatureToggles from './feature-toggles.json';

registerCypressHelpers();

describe('Notification Settings', () => {
  let getCommPrefsStub;
  beforeEach(() => {
    getCommPrefsStub = cy.stub();
    cy.intercept('/v0/feature_toggles?*', mockFeatureToggles);
    cy.intercept(
      '/v0/disability_compensation_form/rating_info',
      disabilityRating,
    );
    cy.intercept('/v0/profile/full_name', fullName);
    cy.intercept('/v0/profile/personal_information', personalInformation);
    cy.intercept('/v0/profile/service_history', serviceHistory);
    cy.intercept('/v0/profile/ch33_bank_accounts', dd4eduNotEnrolled);
    cy.intercept('/v0/ppiu/payment_information', mockPaymentInfoNotEligible);
    cy.intercept('/v0/profile/communication_preferences', req => {
      getCommPrefsStub();
      req.reply({
        statusCode: 200,
        body: mockCommunicationPreferences,
      });
    });
  });
  context('when user is missing mobile phone', () => {
    it('should show the correct messages', () => {
      const user = makeMockUser();
      user.data.attributes.vet360ContactInformation.mobilePhone = null;
      cy.login(user);
      cy.visit(PROFILE_PATHS.NOTIFICATION_SETTINGS);
      cy.findByRole('heading', {
        name: 'Notification settings',
        level: 1,
      }).should('exist');

      cy.loadingIndicatorWorks();

      cy.findByText('veteran@gmail.com').should('exist');
      cy.findByTestId('missing-contact-info-alert')
        .should('exist')
        .and('contain.text', 'mobile phone');
      cy.findByRole('link', { name: /update your contact info/i }).should(
        'exist',
      );
      cy.findAllByRole('link', { name: /add your mobile/i }).should(
        'have.length.above',
        0,
      );
      cy.findAllByTestId('notification-group').should('exist');
    });
  });
  context('when user is missing email address', () => {
    it('should show the correct messages', () => {
      const user = makeMockUser();
      user.data.attributes.vet360ContactInformation.email = null;
      cy.login(user);
      cy.visit(PROFILE_PATHS.NOTIFICATION_SETTINGS);
      cy.findByRole('heading', {
        name: 'Notification settings',
        level: 1,
      }).should('exist');

      cy.loadingIndicatorWorks();

      cy.findByText('503-555-1234').should('exist');
      cy.findByTestId('missing-contact-info-alert')
        .should('exist')
        .and('contain.text', 'email address');
      cy.findByRole('link', { name: /update your contact info/i }).should(
        'exist',
      );
      cy.findAllByRole('link', { name: /add your email/i }).should(
        'have.length.above',
        0,
      );
      cy.findAllByTestId('notification-group').should('exist');
    });
  });
  context('when user is missing both email address and mobile phone', () => {
    it('should show the correct message, not attempt to fetch notification prefs, and hide all notification groups', () => {
      const user = makeMockUser();
      user.data.attributes.vet360ContactInformation.email = null;
      user.data.attributes.vet360ContactInformation.mobilePhone = null;
      cy.login(user);
      cy.visit(PROFILE_PATHS.NOTIFICATION_SETTINGS);
      cy.findByRole('heading', {
        name: 'Notification settings',
        level: 1,
      }).should('exist');

      // there should be no loading indicator
      cy.findByRole('progressbar', { name: /loading/i }).should('not.exist');
      cy.injectAxeThenAxeCheck();

      cy.findByTestId('missing-contact-info-alert')
        .should('exist')
        .and('contain.text', 'mobile phone')
        .and('contain.text', 'email address');
      cy.should(() => {
        expect(getCommPrefsStub).not.to.be.called;
      });
      cy.findByRole('link', { name: /update your contact info/i }).should(
        'exist',
      );
      cy.findAllByTestId('notification-group').should('not.exist');
    });
  });
});

import { PROFILE_PATHS } from '@@profile/constants';

import dd4eduNotEnrolled from '@@profile/tests/fixtures/dd4edu/dd4edu-not-enrolled.json';
import disabilityRating from '@@profile/tests/fixtures/disability-rating-success.json';
import fullName from '@@profile/tests/fixtures/full-name-success.json';
import mockPaymentInfoNotEligible from '@@profile/tests/fixtures/dd4cnp/dd4cnp-is-not-eligible.json';
import personalInformation from '@@profile/tests/fixtures/personal-information-success.json';
import serviceHistory from '@@profile/tests/fixtures/service-history-success.json';

import mockUser from '@@profile/tests/fixtures/users/user-36.json';
import { mockUser as mockUserVAPError } from '@@profile/tests/fixtures/users/user-vap-error.js';
import error500 from '@@profile/tests/fixtures/500.json';

import { registerCypressHelpers } from '../helpers';

import mockFeatureToggles from './feature-toggles.json';

registerCypressHelpers();

describe('Notification Settings - Load Errors', () => {
  beforeEach(() => {
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
  });
  context('when VA Profile contact info is not available', () => {
    it('should show an error message and not even try to fetch current notification preferences', () => {
      const getCommPrefsStub = cy.stub();
      cy.intercept('GET', 'v0/profile/communication_preferences', () => {
        getCommPrefsStub();
      });

      cy.login(mockUserVAPError);
      cy.visit(PROFILE_PATHS.NOTIFICATION_SETTINGS);
      cy.findByRole('heading', {
        name: 'Notification settings',
        level: 1,
      }).should('exist');
      cy.findByText(/We can’t access your.*settings at this time\./i).should(
        'exist',
      );
      cy.should(() => {
        expect(getCommPrefsStub).not.to.be.called;
      });
      cy.findAllByTestId('notification-group').should('not.exist');
      cy.injectAxeThenAxeCheck();
    });
  });
  context('when we cannot fetch current notification preferences', () => {
    it('should show an error message', () => {
      cy.intercept('GET', 'v0/profile/communication_preferences', {
        statusCode: 500,
        data: error500,
      });
      cy.login(mockUser);
      cy.visit(PROFILE_PATHS.NOTIFICATION_SETTINGS);
      cy.findByRole('heading', {
        name: 'Notification settings',
        level: 1,
      }).should('exist');

      cy.loadingIndicatorWorks();
      // and an error message appears
      cy.findByText(/We can’t access your.*settings at this time\./i).should(
        'exist',
      );
      cy.findAllByTestId('notification-group').should('not.exist');
      cy.injectAxeThenAxeCheck();
    });
  });
});

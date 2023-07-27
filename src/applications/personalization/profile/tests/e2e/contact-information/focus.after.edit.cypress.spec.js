import { PROFILE_PATHS } from '@@profile/constants';

import { loa3User72 } from 'applications/personalization/profile/mocks/endpoints/user';

import { generateFeatureToggles } from 'applications/personalization/profile/mocks/endpoints/feature-toggles';
import {
  addressValidation,
  mailingAddressStatusSuccess,
  mailingAddressUpdateReceived,
} from 'applications/personalization/profile/mocks/endpoints/address';

import phoneNumber from 'applications/personalization/profile/mocks/endpoints/phone-number';

describe('focus after editing fields', () => {
  describe('Contact info fields', () => {
    beforeEach(() => {
      cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles());
      cy.login(loa3User72);
      cy.intercept('POST', '/v0/profile/address_validation', addressValidation);
      cy.intercept('PUT', '/v0/profile/addresses', req => {
        req.reply(200, mailingAddressUpdateReceived.response);
      });
      cy.intercept('GET', '/v0/profile/status/*', req => {
        req.reply(200, mailingAddressStatusSuccess);
      });
      cy.intercept('GET', '/v0/user*', loa3User72);
    });

    it('should focus on mailing address button when editing is complete', () => {
      cy.visit(PROFILE_PATHS.CONTACT_INFORMATION);
      // should show a loading indicator
      cy.findByRole('progressbar').should('exist');
      cy.findByText(/loading your information/i).should('exist');

      // and then the loading indicator should be removed
      cy.findByText(/loading your information/i).should('not.exist');
      cy.findByRole('progressbar').should('not.exist');
      cy.injectAxeThenAxeCheck();
      cy.get('#edit-mailing-address').click({ waitForAnimations: true });
      cy.get('[data-testid="save-edit-button"]').click({
        waitForAnimations: true,
      });
      cy.get('[data-testid="confirm-address-button"]').click({
        waitForAnimations: true,
      });
      cy.get('#edit-mailing-address').should('be.focused');
    });
  });
  describe('Phone number fields with SCHEMA form system', () => {
    beforeEach(() => {
      cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles());
      cy.login(loa3User72);

      cy.intercept('GET', '/v0/user*', loa3User72);
      cy.intercept('PUT', '/v0/profile/telephones', req => {
        req.reply(200, phoneNumber.transactions.received);
      });
      cy.intercept('GET', '/v0/profile/status/*', req => {
        req.reply(200, phoneNumber.transactions.successful);
      });
    });
    it('should focus on edit phone number button when editing is complete', () => {
      cy.visit(PROFILE_PATHS.CONTACT_INFORMATION);
      // should show a loading indicator
      cy.findByRole('progressbar').should('exist');
      cy.findByText(/loading your information/i).should('exist');

      // and then the loading indicator should be removed
      cy.findByText(/loading your information/i).should('not.exist');
      cy.findByRole('progressbar').should('not.exist');
      cy.injectAxeThenAxeCheck();

      cy.get('#edit-home-phone-number').click({ waitForAnimations: true });
      cy.get('[data-testid="save-edit-button"]').click({
        waitForAnimations: true,
      });
      cy.get('[data-testid="update-success-alert"]').should('exist');
      cy.get('#edit-home-phone-number').should('be.focused');
    });
  });
});

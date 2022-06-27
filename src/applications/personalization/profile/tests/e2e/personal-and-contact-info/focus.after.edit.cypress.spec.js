import { PROFILE_PATHS_LGBTQ_ENHANCEMENT } from '@@profile/constants';

import { user72Success } from '../../../mocks/user';

import { generateFeatureToggles } from '../../../mocks/feature-toggles';
import {
  addressValidation,
  mailingAddressStatusSuccess,
  mailingAddressUpdateReceived,
} from '../../../mocks/address';

import phoneNumber from '../../../mocks/phone-number';

describe('focus after editing fields', () => {
  describe('Contact info fields', () => {
    beforeEach(() => {
      cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles());
      cy.login(user72Success);
      cy.intercept('POST', '/v0/profile/address_validation', addressValidation);
      cy.intercept('PUT', '/v0/profile/addresses', req => {
        req.reply(200, mailingAddressUpdateReceived.response);
      });
      cy.intercept('GET', '/v0/profile/status/*', req => {
        req.reply(200, mailingAddressStatusSuccess);
      });
      cy.intercept('GET', '/v0/user*', user72Success);
    });

    it('should focus on mailing address button when editing is complete', () => {
      cy.visit(PROFILE_PATHS_LGBTQ_ENHANCEMENT.CONTACT_INFORMATION);
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
  describe('Phone number fields', () => {
    beforeEach(() => {
      cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles());
      cy.login(user72Success);

      cy.intercept('GET', '/v0/user*', user72Success);
      cy.intercept('PUT', '/v0/profile/telephones', req => {
        req.reply(200, phoneNumber.transactions.received);
      });
      cy.intercept('GET', '/v0/profile/status/*', req => {
        req.reply(200, phoneNumber.transactions.successful);
      });
    });
    it('should focus on edit phone number button when editing is complete', () => {
      cy.visit(PROFILE_PATHS_LGBTQ_ENHANCEMENT.CONTACT_INFORMATION);
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

import { badAddress, loa3User72 } from '../../../mocks/endpoints/user';

import { generateFeatureToggles } from '../../../mocks/endpoints/feature-toggles';
import {
  addressValidation,
  mailingAddressUpdateNoChangeDetected,
} from '../../../mocks/endpoints/address';

import BadAddressFeature from './BadAddressFeature';

describe('Bad Address Alert -- Contact Page -- Form alert', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles());

    cy.intercept('GET', '/v0/user', req => {
      req.reply(200, badAddress);
    });

    cy.intercept('GET', '/v0/user*', req => {
      req.reply(200, loa3User72);
    });
  });

  it('should display bad address and dismiss when update is made with COMPLETED_NO_CHANGES_DETECTED', () => {
    cy.login(badAddress);

    cy.intercept('POST', '/v0/profile/address_validation', addressValidation);

    // this is key to simulate the same address being attempted to be updated
    // regardless of what address the form fields show
    cy.intercept(
      'PUT',
      '/v0/profile/addresses',
      mailingAddressUpdateNoChangeDetected,
    );

    // first visit the page and see the alerts
    BadAddressFeature.visitContactInformationPage();
    BadAddressFeature.confirmAlertInFormExists();
    cy.injectAxeThenAxeCheck();

    // starting to update address
    BadAddressFeature.startEditingAddress();
    BadAddressFeature.confirmAlertInFormExists();

    // submitting update
    BadAddressFeature.attemptToSubmitAddress();
    BadAddressFeature.confirmAlertInFormDoesNotExist();
    BadAddressFeature.confirmAddressEntered();

    // // back to the contact page with no more alerts
    BadAddressFeature.confirmUpdatedMessageIsShown();
    BadAddressFeature.confirmAlertInFormDoesNotExist();
  });
});

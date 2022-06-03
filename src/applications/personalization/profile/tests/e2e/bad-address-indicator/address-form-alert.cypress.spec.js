import { badAddress, user72Success } from '../../../mocks/user';

import { generateFeatureToggles } from '../../../mocks/feature-toggles';
import {
  addressValidation,
  mailingAddressStatusSuccess,
  mailingAddressUpdateReceived,
} from '../../../mocks/address';

import BadAddressFeature from './BadAddressFeature';

describe('Bad Address Alert -- Contact Page -- Form alert', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      '/v0/feature_toggles*',
      generateFeatureToggles({ profileShowBadAddressIndicator: true }),
    );

    cy.intercept('GET', '/v0/user', req => {
      req.reply(200, badAddress);
    });
    cy.intercept('GET', '/v0/user*', req => {
      req.reply(200, user72Success);
    });
  });

  it('should display bad address -- happy path', () => {
    cy.login(badAddress);

    cy.intercept('POST', '/v0/profile/address_validation', addressValidation);
    cy.intercept('PUT', '/v0/profile/addresses', req => {
      req.reply(200, mailingAddressUpdateReceived.response);
    });
    cy.intercept('GET', '/v0/profile/status/*', req => {
      req.reply(200, mailingAddressStatusSuccess);
    });

    // first visit the page and see the alerts
    BadAddressFeature.visitContactInformationPage();
    BadAddressFeature.confirmContactInformationAlertIsShowing();
    BadAddressFeature.confirmAlertInFormExists();
    cy.injectAxeThenAxeCheck();

    // starting to update address
    BadAddressFeature.startEditingAddress();
    BadAddressFeature.confirmContactInformationAlertIsShowing();
    BadAddressFeature.confirmAlertInFormExists();

    // submitting "new address"
    BadAddressFeature.attemptToSubmitAddress();
    BadAddressFeature.confirmContactInformationAlertIsNotShowing();
    BadAddressFeature.confirmAlertInFormDoesNotExist();
    BadAddressFeature.confirmAddressEntered();

    // // back to the contact page with no more alerts
    BadAddressFeature.confirmUpdatedMessageIsShown();
    BadAddressFeature.confirmContactInformationAlertIsNotShowing();
    BadAddressFeature.confirmAlertInFormDoesNotExist();
  });

  it('inline form alert should hide when the update failed', () => {
    cy.login(badAddress);

    // first visit the page and see the alerts
    BadAddressFeature.visitContactInformationPage();
    BadAddressFeature.confirmContactInformationAlertIsShowing();
    BadAddressFeature.confirmAlertInFormExists();
    cy.injectAxeThenAxeCheck();

    // submitting "new address"
    BadAddressFeature.startEditingAddress();

    BadAddressFeature.attemptToSubmitAddress();
    BadAddressFeature.confirmErrorMessageInFormExists();
    BadAddressFeature.confirmContactInformationAlertIsShowing();
    BadAddressFeature.confirmAlertInFormDoesNotExist();
  });
  it('scenario 4 -- alerts should persist until I click update', () => {
    cy.login(badAddress);

    cy.intercept('POST', '/v0/profile/address_validation', addressValidation);
    cy.intercept('PUT', '/v0/profile/addresses', req => {
      req.reply(200, mailingAddressUpdateReceived.response);
    });
    cy.intercept('GET', '/v0/profile/status/*', req => {
      req.reply(200, mailingAddressStatusSuccess);
    });

    // first visit the page and see the alerts
    BadAddressFeature.visitContactInformationPage();
    BadAddressFeature.confirmContactInformationAlertIsShowing();
    BadAddressFeature.confirmAlertInFormExists();
    cy.injectAxeThenAxeCheck();

    // starting to update address
    BadAddressFeature.startEditingAddress();
    BadAddressFeature.confirmContactInformationAlertIsShowing();
    BadAddressFeature.confirmAlertInFormExists();

    BadAddressFeature.cancelAddressUpdate();

    BadAddressFeature.confirmContactInformationAlertIsShowing();
    BadAddressFeature.confirmAlertInFormExists();
  });
});

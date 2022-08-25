import { user72Success, badAddress } from '../../../mocks/user';

import { generateFeatureToggles } from '../../../mocks/feature-toggles';
import {
  addressValidation,
  mailingAddressStatusSuccess,
  mailingAddressUpdateReceived,
} from '../../../mocks/address';

import BadAddressFeature from './BadAddressFeature';

describe('Bad Address Alert - Force Bad Address', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      '/v0/feature_toggles*',
      generateFeatureToggles({
        profileShowBadAddressIndicator: true,
        profileForceBadAddressIndicator: true,
      }),
    );
    // clear sessions storage before and after each to
    // to start with a clean slate
    cy.window().then(win => {
      win.sessionStorage.clear();
    });
  });
  afterEach(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });
  });
  it('should display bad address for a user that does have the flag', () => {
    cy.intercept('GET', '/v0/user', user72Success);
    cy.login(user72Success);
    BadAddressFeature.visitPersonalInformationPage();
    cy.injectAxeThenAxeCheck();
    BadAddressFeature.confirmPersonalInformationAlertIsShowing();
    BadAddressFeature.visitContactInformationPage();
    BadAddressFeature.confirmContactInformationAlertIsShowing();
  });
  it('should set session storage on address update', () => {
    cy.login(user72Success);
    cy.intercept('GET', '/v0/user*', user72Success);

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
    cy.window().then(win => {
      expect(
        win.sessionStorage.getItem('profile-has-cleared-bad-address-indicator'),
      ).to.equal('true');
    });
  });
  it('should show the alerts if session storage exists and the user does the BAI flag', () => {
    cy.window().then(win => {
      win.sessionStorage.setItem(
        'profile-has-cleared-bad-address-indicator',
        true,
      );
      cy.intercept('GET', '/v0/user', badAddress);
      cy.login(badAddress);
      BadAddressFeature.visitPersonalInformationPage();
      cy.injectAxeThenAxeCheck();
      BadAddressFeature.confirmPersonalInformationAlertIsShowing();
      BadAddressFeature.visitContactInformationPage();
      BadAddressFeature.confirmContactInformationAlertIsShowing();
    });
  });
  it('should not show the alerts if session storage exists and the user does not the BAI flag', () => {
    cy.window().then(win => {
      win.sessionStorage.setItem(
        'profile-has-cleared-bad-address-indicator',
        true,
      );
      cy.intercept('GET', '/v0/user', user72Success);
      cy.login(user72Success);
      BadAddressFeature.visitPersonalInformationPage();
      cy.injectAxeThenAxeCheck();
      BadAddressFeature.confirmPersonalInformationAlertIsNotShowing();
      BadAddressFeature.visitContactInformationPage();
      BadAddressFeature.confirmContactInformationAlertIsNotShowing();
    });
  });
});

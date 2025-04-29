import BaseListPage from './BaseListPage';
import optedIn from '../fixtures/opted-in-status.json';
import postOptOutResponse from '../fixtures/post-opt-out-response.json';
import postOptInResponse from '../fixtures/post-opt-in-response.json';

class SettingsPage extends BaseListPage {
  visitSettingsPage = () => {
    cy.intercept(
      'GET',
      'my_health/v1/health_records/sharing/status',
      optedIn,
    ).as('statusOptedIn');
    cy.visit('my-health/medical-records/settings');
    cy.wait('@statusOptedIn');
  };

  verifyOptedInStatus = () => {
    cy.get('va-card')
      .find('h3')
      .contains('Your sharing setting: Opted in');
  };

  verifyOptedOutStatus = () => {
    cy.get('va-card')
      .find('h3')
      .contains('Your sharing setting: Opted out');
  };

  verifyOptedOutAlert = () => {
    cy.get('section')
      .eq(1)
      .find('va-alert')
      .contains('Opted out of sharing');
  };

  verifyOptedInAlert = () => {
    cy.get('section')
      .eq(1)
      .find('va-alert')
      .contains('Opted in to sharing');
  };

  selectOptOut = () => {
    cy.intercept(
      'POST',
      'my_health/v1/health_records/sharing/optout',
      postOptOutResponse,
    ).as('postOptOut');

    cy.get('[data-testid="open-opt-in-out-modal-button"]').click();
    cy.get('va-modal')
      .contains('button', 'Opt out')
      .click();
    cy.wait('@postOptOut');
  };

  selectOptIn = () => {
    cy.intercept(
      'POST',
      'my_health/v1/health_records/sharing/optin',
      postOptInResponse,
    ).as('postOptIn');

    cy.get('[data-testid="open-opt-in-out-modal-button"]').click();
    cy.get('va-modal')
      .contains('button', 'Opt in')
      .click();
    cy.wait('@postOptIn');
  };
}

export default new SettingsPage();

import PatientInboxPage from '../pages/PatientInboxPage';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import mockNoRecipients from '../fixtures/recipientsResponse/no-recipients-response.json';
import allRecipientsBlocked from '../fixtures/recipientsResponse/all-TG-blocked-recipients-response.json';
import { AXE_CONTEXT, Locators, Paths, Alerts } from '../utils/constants';

describe('SM TRIAGE GROUPS ALERTS', () => {
  it('user not associated with any group', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadPageForNoProvider(mockNoRecipients);

    cy.get(Locators.ALERTS.BLOCKED_GROUP)
      .find(`h2`)
      .should('contain.text', Alerts.NO_ASSOCIATION.AT_ALL_HEADER);

    cy.get(Locators.ALERTS.BLOCKED_GROUP)
      .find(`p`)
      .should(`be.visible`)
      .and(`contain.text`, Alerts.NO_ASSOCIATION.PARAGRAPH);

    cy.get(Locators.ALERTS.TRIAGE_ALERT).should(
      'have.attr',
      'href',
      Paths.FIND_LOCATIONS,
    );

    cy.findByTestId(Locators.LINKS.CREATE_NEW_MESSAGE_DATA_TEST_ID).should(
      'not.exist',
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('user blocked from all groups', () => {
    const allBlockedResponse = {
      ...allRecipientsBlocked,
    };

    SecureMessagingSite.login();
    PatientInboxPage.loadPageForNoProvider(allBlockedResponse);

    cy.get(Locators.ALERTS.BLOCKED_GROUP)
      .find(`h2`)
      .should('contain.text', Alerts.BLOCKED.HEADER);

    cy.get(Locators.ALERTS.BLOCKED_GROUP)
      .find(`p`)
      .should(`be.visible`)
      .and(`contain.text`, Alerts.BLOCKED.ALL_PARAGRAPH);

    cy.get(Locators.ALERTS.TRIAGE_ALERT).should(
      'have.attr',
      'href',
      Paths.FIND_LOCATIONS,
    );

    cy.findByTestId(Locators.LINKS.CREATE_NEW_MESSAGE_DATA_TEST_ID).should(
      'not.exist',
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});

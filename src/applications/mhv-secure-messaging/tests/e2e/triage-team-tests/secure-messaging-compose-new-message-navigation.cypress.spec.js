import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import { AXE_CONTEXT, Locators, Data, Alerts, Paths } from '../utils/constants';
import mockNoRecipients from '../fixtures/recipientsResponse/no-recipients-response.json';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import PatientInboxPage from '../pages/PatientInboxPage';
import mockMessages from '../fixtures/threads-response.json';
import mockSingleMessage from '../fixtures/inboxResponse/single-message-response.json';
import mockFacilityBlockedRecipients from '../fixtures/recipientsResponse/all-TG-blocked-recipients-response.json';

describe('SM USER NEW MESSAGE COMPOSE NAVIGATION', () => {
  it('verify non-associated user could not visit new message page using direct url', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadPageForNoProvider(mockNoRecipients);

    cy.visit(Paths.NEW_MESSAGE);

    GeneralFunctionsPage.verifyPageHeader(Data.START_NEW_MSG);

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

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify blocked user could not visit new message page using direct url', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages(
      mockMessages,
      mockSingleMessage,
      mockFacilityBlockedRecipients,
    );

    cy.visit(Paths.NEW_MESSAGE);

    GeneralFunctionsPage.verifyPageHeader(Data.START_NEW_MSG);

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

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});

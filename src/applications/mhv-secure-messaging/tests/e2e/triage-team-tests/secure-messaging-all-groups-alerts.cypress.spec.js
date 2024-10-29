import PatientInboxPage from '../pages/PatientInboxPage';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import noAssociationResponse from '../fixtures/no-goups-association.json';
import { AXE_CONTEXT, Locators, Paths, Alerts } from '../utils/constants';

describe('SM TRIAGE GROUPS ALERTS', () => {
  it('user not associated with any group', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadPageForNoProvider(noAssociationResponse);

    cy.get(Locators.ALERTS.TRIAGE_GROUP)
      .find(`h2`)
      .should('contain.text', Alerts.NO_ASSOCIATION.AT_ALL_HEADER);

    cy.get(Locators.ALERTS.TRIAGE_GROUP)
      .find(`p`)
      .should(`be.visible`)
      .and(`contain.text`, Alerts.NO_ASSOCIATION.PARAGRAPH);

    cy.get(Locators.ALERTS.TRIAGE_ALERT).should(
      'have.attr',
      'href',
      Paths.FIND_LOCATIONS,
    );

    cy.get(Locators.LINKS.CREATE_NEW_MESSAGE).should('not.exist');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('user blocked from all groups', () => {
    const allBlockedResponse = {
      ...noAssociationResponse,
      meta: {
        ...noAssociationResponse.meta,
        associatedTriageGroups: 7,
        associatedBlockedTriageGroups: 7,
      },
    };

    SecureMessagingSite.login();
    PatientInboxPage.loadPageForNoProvider(allBlockedResponse);

    cy.get(Locators.ALERTS.TRIAGE_GROUP)
      .find(`h2`)
      .should('contain.text', Alerts.BLOCKED.HEADER);

    cy.get(Locators.ALERTS.TRIAGE_GROUP)
      .find(`p`)
      .should(`be.visible`)
      .and(`contain.text`, Alerts.BLOCKED.ALL_PARAGRAPH);

    cy.get(Locators.ALERTS.TRIAGE_ALERT).should(
      'have.attr',
      'href',
      Paths.FIND_LOCATIONS,
    );

    cy.get(Locators.LINKS.CREATE_NEW_MESSAGE).should('not.exist');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});

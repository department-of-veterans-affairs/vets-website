import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import { AXE_CONTEXT, Locators } from '../utils/constants';
import PatientMessageDraftsPage from '../pages/PatientMessageDraftsPage';
import mockMultiDraftsResponse from '../fixtures/draftsResponse/multi-draft-response.json';
import tripleDraftsResponse from '../fixtures/draftsResponse/triple-draft-response.json';

describe('handle multiple drafts in one thread', () => {
  const site = new SecureMessagingSite();
  const landingPage = new PatientInboxPage();
  const draftPage = new PatientMessageDraftsPage();

  beforeEach(() => {
    site.login();
    landingPage.loadInboxMessages();
    draftPage.loadMultiDraftThread(mockMultiDraftsResponse);
  });

  it('verify interface', () => {
    const draftsCount = mockMultiDraftsResponse.data.filter(
      el => el.attributes.draftDate !== null,
    ).length;

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    cy.get(Locators.REPLY_FORM)
      .find('h2')
      .should('be.visible')
      .and('contain.text', `${draftsCount} drafts`);

    cy.get(Locators.ALERTS.EXPIRED_MESSAGE)
      .should('be.visible')
      .and('include.text', 'too old');

    cy.get(Locators.ALERTS.LAST_EDIT_DATE).each(el => {
      cy.wrap(el).should('include.text', 'edited');
    });

    cy.get(Locators.BUTTONS.SEND).should('not.exist');
    cy.get(Locators.ALERTS.EDIT_DRAFT).click();
    cy.get(Locators.BUTTONS.SEND).should('not.exist');
  });
});

describe.skip('triple draft a11y error', () => {
  const site = new SecureMessagingSite();
  const landingPage = new PatientInboxPage();
  const draftPage = new PatientMessageDraftsPage();

  beforeEach(() => {
    site.login();
    landingPage.loadInboxMessages();
    draftPage.loadMultiDraftThread(tripleDraftsResponse);
  });

  it('a11y verification', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});

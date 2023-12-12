import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import { AXE_CONTEXT } from '../utils/constants';
import PatientMessageDraftsPage from '../pages/PatientMessageDraftsPage';
import mockMultiDraftsResponse from '../fixtures/draftsResponse/multi-draft-response.json';

describe('re-save multiple drafts in one thread', () => {
  const site = new SecureMessagingSite();
  const landingPage = new PatientInboxPage();
  const draftPage = new PatientMessageDraftsPage();

  it('verify first draft could be re-saved', () => {
    site.login();
    landingPage.loadInboxMessages();
    draftPage.loadMultiDraftThread(mockMultiDraftsResponse);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });

    // cy.get('[id="reply-message-body"]').shadow().find('#textarea', ).should('be.enabled', {timeout: 10000}).type('newText',{ waitForAnimations: true })

    cy.get('[id="reply-message-body"]')
      .shadow()
      .find('#textarea')
      .should('be.enabled')
      .click({ waitForAnimations: true });
    // cy.wait(10000)
    cy.get('[id="reply-message-body"]')
      .shadow()
      .find('#textarea')
      .type('newText', { waitForAnimations: true });

    // cy.get('#textarea').should('be.enabled').type('newText', {waitForAnimations: true})
  });

  it('verify second draft could be re-saved', () => {
    site.login();
    landingPage.loadInboxMessages();
    draftPage.loadMultiDraftThread();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });
});

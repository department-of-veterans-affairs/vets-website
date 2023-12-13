import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import { AXE_CONTEXT, Locators } from '../utils/constants';
import PatientMessageDraftsPage from '../pages/PatientMessageDraftsPage';
import mockMultiDraftsResponse from '../fixtures/draftsResponse/multi-draft-response.json';

describe('re-save multiple drafts in one thread', () => {
  const site = new SecureMessagingSite();
  const landingPage = new PatientInboxPage();
  const draftPage = new PatientMessageDraftsPage();

  beforeEach(() => {
    site.login();
    landingPage.loadInboxMessages();
    draftPage.loadMultiDraftThread(mockMultiDraftsResponse);
  });

  it('verify first draft could be re-saved', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });

    cy.get('#textarea').type('newText', { force: true });
    draftPage.saveMultiDraftMessage(
      mockMultiDraftsResponse.data[0],
      mockMultiDraftsResponse.data[0].attributes.messageId,
    );

    cy.get(Locators.ALERTS.SAVE_DRAFT).should(
      'include.text',
      'message was saved',
    );
  });

  it('verify second draft could be re-saved', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });

    cy.get('#edit-draft-button').click({ waitForAnimations: true });
    cy.get('#textarea').type('newText', { force: true });
    draftPage.saveMultiDraftMessage(
      mockMultiDraftsResponse.data[1],
      mockMultiDraftsResponse.data[1].attributes.messageId,
    );

    cy.get(Locators.ALERTS.SAVE_DRAFT).should(
      'include.text',
      'message was saved',
    );
  });
});

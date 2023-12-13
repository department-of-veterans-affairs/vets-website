import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import { AXE_CONTEXT, Locators } from '../utils/constants';
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

    cy.get('#textarea').type('newText', { force: true });

    cy.intercept(
      'PUT',
      'my_health/v1/messaging/message_drafts/3163320/replydraft/3163906',
      { data: mockMultiDraftsResponse.data[0] },
    ).as('saveDraft');
    cy.get(Locators.BUTTONS.SAVE_DRAFT).click();
    cy.wait('@saveDraft');

    cy.get('.last-save-time > .vads-u-margin-y--0').should(
      'include.text',
      'message was saved',
    );
  });

  it.skip('verify second draft could be re-saved', () => {
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

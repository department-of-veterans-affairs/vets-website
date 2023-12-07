import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import { AXE_CONTEXT, Locators } from './utils/constants';
import mockMultiDraftsResponse from './fixtures/draftsResponse/multi-draft-response.json';
import { Alerts } from '../../util/constants';

describe.skip('handle multiple drafts in one thread', () => {
  const site = new SecureMessagingSite();
  const landingPage = new PatientInboxPage();
  const draftPage = new PatientMessageDraftsPage();

  beforeEach(() => {
    site.login();
    landingPage.loadInboxMessages();
    landingPage.loadSingleThread(mockMultiDraftsResponse);
  });

  it('verify headers', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });

    cy.get('[data-testid="reply-form"]')
      .find('h2')
      .should('be.visible')
      .and('contain.text', '2 drafts');

    cy.get('[data-testid="reply-form"]')
      .find('h3')
      .each(el => {
        cy.wrap(el).should('include.text', 'Draft');
      });
  });

  it('verify draft could be re-saved', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });

    draftPage.saveDraftMessage(mockMultiDraftsResponse.data[0]);
    cy.get(Locators.BUTTONS.SAVE_DRAFT).click({ waitForAnimations: true });

    cy.get('.last-save-time > .vads-u-margin-y--0').should(
      'include.text',
      'Your message was saved ',
    );
  });

  it('verify draft could be send', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });

    draftPage.replyDraftMessage(
      mockMultiDraftsResponse.data[0],
      mockMultiDraftsResponse.data[0].attributes.messageId,
    );

    draftPage.verifyConfirmationMessage(Alerts.Message.SEND_MESSAGE_SUCCESS);
  });

  it('verify draft could be deleted', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });

    draftPage.deleteDraftMessage(
      mockMultiDraftsResponse.data[0],
      mockMultiDraftsResponse.data[0].attributes.messageId,
    );
    draftPage.verifyConfirmationMessage(Alerts.Message.DELETE_DRAFT_SUCCESS);
  });

  it('verify managing drafts', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });

    cy.get('[data-testid="message-body-field"]')
      .should('be.visible')
      .and('have.attr', 'value')
      .and('not.be.empty');
    cy.contains('Edit draft')
      .should('be.visible')
      .click({ waitForAnimations: true });
    cy.get('[data-testid="message-body-field"]')
      .should('be.visible')
      .and('have.attr', 'value')
      .and('not.be.empty');
  });
});

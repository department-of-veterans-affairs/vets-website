import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import { AXE_CONTEXT, Locators, Paths } from '../utils/constants';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import PilotEnvPage from '../pages/PilotEnvPage';
import PatientInterstitialPage from '../pages/PatientInterstitialPage';
import mockSentThreads from '../fixtures/sentResponse/sent-messages-response.json';
import PatientComposePage from '../pages/PatientComposePage';
import mockSentMessageResponse from '../fixtures/sentResponse/sent-single-message-response.json';

describe('SM CURATED LIST MAIN FLOW', () => {
  beforeEach(() => {
    const updatedFeatureToggles = GeneralFunctionsPage.updateFeatureToggles([
      {
        name: 'mhv_secure_messaging_cerner_pilot',
        value: true,
      },
    ]);
    SecureMessagingSite.login(updatedFeatureToggles);
    PilotEnvPage.loadInboxMessages();
  });

  it('verify select care team page', () => {
    cy.get(Locators.LINKS.CREATE_NEW_MESSAGE).click({ force: true });
    PatientInterstitialPage.getContinueButton().click({ force: true });
    cy.get(`h1`)
      .should(`be.focused`)
      .and(`have.text`, `Select care team`);
    cy.get(`va-radio-option`).should('have.length', 4);
    cy.get(`.vads-u-margin-bottom--1 > a`)
      .should(`have.attr`, `href`, '/my-health/secure-messages-pilot/')
      .and('have.text', `What to do if you can’t find your care team`);

    cy.get(`.vads-u-margin-top--2 > a`)
      .should(
        `have.attr`,
        `href`,
        '/my-health/secure-messages-pilot/contact-list/',
      )
      .and('have.text', `Update your contact list`);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify navigating to compose page', () => {
    cy.get(Locators.LINKS.CREATE_NEW_MESSAGE).click({ force: true });
    PatientInterstitialPage.getContinueButton().click({ force: true });
    cy.get(`va-radio-option`)
      .first()
      .click();

    cy.get('.usa-combo-box')
      .click()
      .type('{downarrow}{enter}');

    cy.intercept(`GET`, Paths.INTERCEPT.SENT_THREADS, mockSentThreads).as(
      'sentThreadsResponse',
    );
    cy.findByTestId(`continue-button`).click();

    GeneralFunctionsPage.verifyPageHeader(`Start your message`);
    cy.findByTestId(`compose-recipient-title`).should(`not.be.empty`);
    cy.contains(`Select a different care team`)
      .should(`be.visible`)
      .and(
        `have.attr`,
        `href`,
        '/my-health/secure-messages-pilot/new-message/select-care-team',
      );
  });

  it('verify user can send a message', () => {
    cy.get(Locators.LINKS.CREATE_NEW_MESSAGE).click({ force: true });
    PatientInterstitialPage.getContinueButton().click({ force: true });
    cy.get(`va-radio-option`)
      .first()
      .click();

    cy.get('.usa-combo-box')
      .click()
      .type('{downarrow}{enter}');

    cy.intercept(`GET`, Paths.INTERCEPT.SENT_THREADS, mockSentThreads).as(
      'sentThreadsResponse',
    );
    cy.findByTestId(`continue-button`).click();

    PatientComposePage.selectCategory();
    PatientComposePage.getMessageSubjectField().type(`TEST SUBJECT`);
    PatientComposePage.getMessageBodyField()
      .clear()
      .type(`TEST BODY`);

    cy.intercept('POST', Paths.SM_API_EXTENDED, mockSentMessageResponse).as(
      'message',
    );
    cy.get(Locators.BUTTONS.SEND)
      .contains('Send')
      .click({ force: true });

    cy.findByTestId(`alert-text`)
      .should(`be.visible`)
      .and(`contain.text`, `Message Sent.`);
  });
});

import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import { AXE_CONTEXT, Data, Locators, Alerts, Paths } from './utils/constants';

describe('Secure Messaging Digital Signature Error flows', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.navigateToComposePage();
    PatientComposePage.selectRecipient('Record Amendment Admin');
    PatientComposePage.selectCategory();
    PatientComposePage.getMessageSubjectField().type(`DS test`, {
      force: true,
    });
    PatientComposePage.getMessageBodyField().type(`{home}DS tests text`, {
      force: true,
      moveToStart: true,
    });

    PatientComposePage.verifyElectronicSignature();
    PatientComposePage.verifyElectronicSignatureRequired();
  });

  it(`verify user can't send a message without electronic signature`, () => {
    cy.get(Locators.BUTTONS.SEND).click({ force: true });

    cy.get(Locators.ALERTS.EL_SIGN_NAME).should(
      'contain.text',
      Alerts.EL_SIGN_NAME,
    );

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it(`verify user can't send a message without checkbox`, () => {
    PatientComposePage.getElectronicSignatureField().type('Dusty Dump ', {
      force: true,
    });
    cy.get(Locators.BUTTONS.SEND).click({ force: true });
    cy.get(Locators.ALERTS.EL_SIGN_CHECK).should(
      `have.text`,
      Alerts.EL_SIGN_CHECK,
    );

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it(`verify user can't save a message with electronic signature`, () => {
    PatientComposePage.getElectronicSignatureField().type('Dusty Dump ', {
      force: true,
    });

    PatientComposePage.clickElectronicSignatureCheckbox();

    cy.get(Locators.BUTTONS.SAVE_DRAFT).dblclick();

    cy.get(Locators.ALERTS.ALERT_MODAL)
      .shadow()
      .find('h2')
      .should('have.text', Alerts.SAVE_SIGN);

    PatientComposePage.getAlertEditDraftBtn()
      .first()
      .should('have.attr', 'text', Data.BUTTONS.EDIT_DRAFT);
    PatientComposePage.getAlertEditDraftBtn()
      .last()
      .should('have.attr', 'text', Data.BUTTONS.SAVE_DRAFT_WO_SIGN);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);

    PatientComposePage.closeESAlertModal();
  });

  it(`verify user can't save a message with electronic signature and attachment`, () => {
    PatientComposePage.getElectronicSignatureField().type('Dusty Dump ', {
      force: true,
    });
    PatientComposePage.attachMessageFromFile(Data.TEST_IMAGE);
    PatientComposePage.clickElectronicSignatureCheckbox();

    cy.get(Locators.BUTTONS.SAVE_DRAFT).dblclick();

    cy.get(Locators.ALERTS.ALERT_MODAL)
      .shadow()
      .find('h2')
      .should('have.text', Alerts.SAVE_SIGN_ATTCH);

    PatientComposePage.getAlertEditDraftBtn()
      .first()
      .should('have.attr', 'text', Data.BUTTONS.EDIT_DRAFT);
    PatientComposePage.getAlertEditDraftBtn()
      .last()
      .should('have.attr', 'text', Data.BUTTONS.SAVE_DRAFT_WO_SIGN_ATTCH);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);

    PatientComposePage.closeESAlertModal();
  });

  it('verify no signature alerts with auto save', () => {
    cy.intercept('POST', Paths.INTERCEPT.DRAFT_AUTO_SAVE).as('autoSaveDraft');

    // Trigger auto-save by making a small change
    cy.findByTestId('message-body-field')
      .shadow()
      .find('#input-type-textarea')
      .type(' additional text');

    // Wait for auto-save to complete
    cy.wait('@autoSaveDraft', { timeout: 15000 });

    cy.findByText(Alerts.EL_SIGN_NAME).should('not.exist');
    cy.findByText(Alerts.EL_SIGN_CHECK).should('not.exist');

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});

describe('Secure Messaging Oracle Health Digital Signature Error flows', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.navigateToComposePage();
    PatientComposePage.selectRecipient('VHA 649 Release of Information (ROI)');
    PatientComposePage.selectCategory();
    PatientComposePage.getMessageSubjectField().type(`Oracle Health DS test`, {
      force: true,
    });
    PatientComposePage.getMessageBodyField().type(
      `{home}Oracle Health signature tests`,
      {
        force: true,
        moveToStart: true,
      },
    );

    PatientComposePage.verifyElectronicSignature();
    PatientComposePage.verifyElectronicSignatureRequired();
  });

  it(`verify user can't send Oracle Health message without electronic signature`, () => {
    cy.get(Locators.BUTTONS.SEND).click({ force: true });

    cy.get(Locators.ALERTS.EL_SIGN_NAME).should(
      'contain.text',
      Alerts.EL_SIGN_NAME,
    );

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it(`verify user can't send Oracle Health message without checkbox`, () => {
    PatientComposePage.getElectronicSignatureField().type('Test User ', {
      force: true,
    });
    cy.get(Locators.BUTTONS.SEND).click({ force: true });
    cy.get(Locators.ALERTS.EL_SIGN_CHECK).should(
      `have.text`,
      Alerts.EL_SIGN_CHECK,
    );

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it(`verify user can't save Oracle Health message with electronic signature`, () => {
    PatientComposePage.getElectronicSignatureField().type('Test User ', {
      force: true,
    });

    PatientComposePage.clickElectronicSignatureCheckbox();

    cy.get(Locators.BUTTONS.SAVE_DRAFT).dblclick();

    cy.get(Locators.ALERTS.ALERT_MODAL)
      .shadow()
      .find('h2')
      .should('have.text', Alerts.SAVE_SIGN);

    PatientComposePage.getAlertEditDraftBtn()
      .first()
      .should('have.attr', 'text', Data.BUTTONS.EDIT_DRAFT);
    PatientComposePage.getAlertEditDraftBtn()
      .last()
      .should('have.attr', 'text', Data.BUTTONS.SAVE_DRAFT_WO_SIGN);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);

    PatientComposePage.closeESAlertModal();
  });
});

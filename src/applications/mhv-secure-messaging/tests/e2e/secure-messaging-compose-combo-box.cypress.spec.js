import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import { AXE_CONTEXT, Locators, Data } from './utils/constants';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import mockRecipients from './fixtures/recipientsResponse/recipients-response.json';

describe('SM MESSAGING COMBO BOX', () => {
  const mockRequestBody = {
    category: 'COVID',
    body: 'testBody',
    // eslint-disable-next-line camelcase
    recipient_id: '6832726',
    subject: 'testSubject',
  };
  const updatedFeatureToggles = GeneralFunctionsPage.updateFeatureToggles([
    {
      name: 'mhv_secure_messaging_recipient_combobox',
      value: true,
    },
  ]);
  beforeEach(() => {
    SecureMessagingSite.login(updatedFeatureToggles);
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.navigateToComposePage();
  });

  it('verify drop down list behavior', () => {
    PatientComposePage.verifyHeader(Data.START_NEW_MSG);
    cy.get(Locators.FIELDS.RECIPIENTS_COMBO).click();
    cy.get(Locators.DROPDOWN.RECIPIENTS_COMBO).should('be.visible');

    PatientComposePage.selectComboBoxRecipient('TG');
    PatientComposePage.verifyRecipientsDropdownList('TG');

    PatientComposePage.selectComboBoxRecipient('slc');
    PatientComposePage.verifyRecipientsDropdownList('SLC');

    cy.get(Locators.BUTTONS.DELETE_DRAFT).click();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify combo box auto select', () => {
    PatientComposePage.selectComboBoxRecipient('TG');
    cy.realPress('Enter');
    PatientComposePage.verifyRecipientSelected('0');

    PatientComposePage.selectComboBoxRecipient('TG-7410');
    cy.realPress('Enter');
    PatientComposePage.verifyRecipientSelected(mockRecipients.data[1].id);

    cy.get(Locators.BUTTONS.DELETE_DRAFT).click();
    cy.get(Locators.BUTTONS.DELETE_CONFIRM).click();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify user can send a message', () => {
    PatientComposePage.selectComboBoxRecipient('TG-7410');
    cy.realPress('Enter');
    PatientComposePage.selectCategory('COVID');
    PatientComposePage.enterDataToMessageSubject('testSubject');
    PatientComposePage.enterDataToMessageBody('{moveToStart}testBody');
    PatientComposePage.sendMessage(mockRequestBody);
    PatientComposePage.verifySendMessageConfirmationMessageText();
    PatientComposePage.verifySendMessageConfirmationMessageHasFocus();
    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});

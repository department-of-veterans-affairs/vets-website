import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import { AXE_CONTEXT, Data } from './utils/constants';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';

describe('SM MESSAGING COMBO BOX ALERTS', () => {
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

  it('verify recipient selected', () => {
    PatientComposePage.verifyHeader(Data.START_NEW_MSG);

    PatientComposePage.selectCategory('COVID');
    PatientComposePage.enterDataToMessageSubject('testSubject');
    PatientComposePage.enterDataToMessageBody('{moveToStart}testBody');
    PatientComposePage.sendMessageWithoutVerification();

    PatientComposePage.verifyRecipientsFieldAlert(Data.PLEASE_SELECT_RECIPIENT);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  // e2e below currently commented out as updated alert text hasn't implemented yet

  // it('verify valid recipient selected', () => {
  //   PatientComposePage.selectComboBoxRecipient('WZXY');
  //   cy.realPress('Enter');
  //
  //   PatientComposePage.selectCategory('COVID');
  //   PatientComposePage.enterDataToMessageSubject('testSubject');
  //   PatientComposePage.enterDataToMessageBody('{moveToStart}testBody');
  //   PatientComposePage.sendMessageWithoutVerification();
  //
  //   cy.get(Locators.ALERTS.COMBO_BOX).should(
  //     `have.text`,
  //     Data.PLEASE_SELECT_VALID_RECIPIENT,
  //   );
  //
  //   cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  // });
});

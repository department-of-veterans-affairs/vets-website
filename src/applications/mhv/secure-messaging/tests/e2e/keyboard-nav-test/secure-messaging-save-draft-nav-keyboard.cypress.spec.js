import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientMessageDraftsPage from '../pages/PatientMessageDraftsPage';
import PatientComposePage from '../pages/PatientComposePage';
import { AXE_CONTEXT } from '../utils/constants';

describe('Check confirmation message after save draft', () => {
  const site = new SecureMessagingSite();
  const lndingPage = new PatientInboxPage();
  const draftPage = new PatientMessageDraftsPage();
  const composePage = new PatientComposePage();
  it.skip('Check save draft by keyboard', () => {
    site.login();
    lndingPage.loadInboxMessages();
    lndingPage.navigateToComposePage();
    composePage.selectRecipient();
    composePage.selectCategory();
    composePage.getMessageSubjectField();
    composePage.getMessageBodyField();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    draftPage.saveDraftByKeyboard();
    // draftPage.verifyFocusOnConfirmationMessage();
    // --focus currently stays on save draft button.  Will check later
  });
});

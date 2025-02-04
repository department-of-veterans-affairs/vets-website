import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import { AXE_CONTEXT, Locators } from './utils/constants';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import singleThreadResponse from './fixtures/thread-response-new-api.json';

describe('SM -PRINT FUNCTIONALITY', () => {
  it('verify buton and functionality', () => {
    const updatedSingleThreadResponse = GeneralFunctionsPage.updatedThreadDates(
      singleThreadResponse,
    );
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientMessageDetailsPage.loadSingleThread(updatedSingleThreadResponse);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    cy.get(Locators.BUTTONS.PRINT).should('be.visible');
    cy.get(Locators.BUTTONS.PRINT).click();
    cy.window().then(win => {
      cy.get(Locators.BUTTONS.PRINT).should('be.visible');
      expect(win.print).to.be.calledOnce;
    });
  });
});

import PatientInboxPage from '../pages/PatientInboxPage';
import PatientMessageDetailsPage from '../pages/PatientMessageDetailsPage';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import { AXE_CONTEXT, Locators } from '../utils/constants';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import singleThreadResponse from '../fixtures/thread-response-new-api.json';

describe('Navigate to Message Details ', () => {
  beforeEach(() => {
    const updatedSingleThreadResponse = GeneralFunctionsPage.updatedThreadDates(
      singleThreadResponse,
    );
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientMessageDetailsPage.loadSingleThread(updatedSingleThreadResponse);
  });

  it('keyboard navigation to expand messages', () => {
    PatientMessageDetailsPage.verifyMessageExpandAndFocusByKeyboard();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('keyboard navigation to main buttons', () => {
    PatientMessageDetailsPage.verifyButtonsKeyboardNavigation();

    cy.tabToElement('#print-button')
      .should('contain', 'Print')
      .and('have.focus');

    cy.realPress('Tab');
    cy.get(Locators.BUTTONS.MOVE)
      .should(`contain`, `Move`)
      .and('have.focus');

    cy.realPress('Tab');
    cy.get(Locators.BUTTONS.TRASH)
      .should(`contain`, `Trash`)
      .and('have.focus');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});

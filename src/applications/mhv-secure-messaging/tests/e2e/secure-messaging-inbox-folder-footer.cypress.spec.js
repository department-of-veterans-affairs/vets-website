import SecureMessagingSite from './sm_site/SecureMessagingSite';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import PatientInboxPage from './pages/PatientInboxPage';
import mockInboxNoMessages from './fixtures/empty-thread-response.json';
import { AXE_CONTEXT, Data, Locators, Paths } from './utils/constants';
import { smFooter } from '../../util/constants';

describe('SM INBOX FOOTER', () => {
  beforeEach(() => {
    const updatedFeatureTogglesResponse = GeneralFunctionsPage.updateFeatureToggles(
      [],
    );

    SecureMessagingSite.login(updatedFeatureTogglesResponse);
  });

  it('inbox with messages footer', () => {
    PatientInboxPage.loadInboxMessages();

    cy.get(Locators.INBOX_FOOTER).should(`be.visible`);
    cy.contains(smFooter.NEED_HELP).should(`be.visible`);
    cy.contains(smFooter.HAVE_QUESTIONS).should(`be.visible`);
    cy.contains(smFooter.CONTACT_FACILITY).should(`be.visible`);
    cy.contains(smFooter.LEARN_MORE)
      .should(`be.visible`)
      .and(`have.attr`, `href`, Paths.HEALTH_CARE_SEND_RECEIVE_MSG);
    cy.contains(smFooter.FIND_FACILITY)
      .should(`be.visible`)
      .and(`have.attr`, `href`, Paths.FIND_LOCATION);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('inbox without messages footer', () => {
    PatientInboxPage.loadInboxMessages(mockInboxNoMessages);

    cy.get(Locators.NO_MESS).should('have.text', Data.NO_MSG_IN_FOLDER);

    cy.get(Locators.INBOX_FOOTER).should(`be.visible`);
    cy.contains(smFooter.NEED_HELP).should(`be.visible`);
    cy.contains(smFooter.HAVE_QUESTIONS).should(`be.visible`);
    cy.contains(smFooter.CONTACT_FACILITY).should(`be.visible`);
    cy.contains(smFooter.LEARN_MORE)
      .should(`be.visible`)
      .and(`have.attr`, `href`, Paths.HEALTH_CARE_SEND_RECEIVE_MSG);
    cy.contains(smFooter.FIND_FACILITY)
      .should(`be.visible`)
      .and(`have.attr`, `href`, Paths.FIND_LOCATION);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});

import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import LandingPage from '../pages/SecureMessagingLandingPage';
import { AXE_CONTEXT, Locators, Data } from '../utils/constants';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';

describe('SM LANDING PAGE FAQ', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    LandingPage.loadMainPage();
  });

  it('verify page content', () => {
    GeneralFunctionsPage.verifyPageHeader('Messages');
    cy.get(Locators.FAQ_ACC_ITEM).each(el => {
      cy.wrap(el).should(`have.prop`, `open`, false);
    });

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify first FAQ accordion', () => {
    cy.tabToElement(`[data-dd-action-name*="send"]`);
    cy.realPress(`Enter`);
    LandingPage.verifyFaqAccordionStatus('send', true);

    cy.realPress(`Tab`);
    LandingPage.verifyFaqFocusedLink(
      Data.FAQ_LINK.URL.SEND,
      Data.FAQ_LINK.TEXT.SEND,
    );
  });

  it('verify second FAQ accordion', () => {
    cy.tabToElement(`[data-dd-action-name*="emergency"]`);
    cy.realPress(`Enter`);
    LandingPage.verifyFaqAccordionStatus('emergency', true);
    LandingPage.verifyFaqAccordionStatus('send', false);

    cy.realPress(`Tab`);
    cy.focused().should(`have.text`, Data.FAQ_LINK.TEXT.EMRG_BTN);
    cy.realPress(`Tab`);
    LandingPage.verifyFaqFocusedLink(
      Data.FAQ_LINK.URL.EMRG,
      Data.FAQ_LINK.TEXT.EMRG,
    );
  });

  it('verify third FAQ accordion', () => {
    cy.tabToElement(`[data-dd-action-name*="protect"]`);
    cy.realPress(`Enter`);
    LandingPage.verifyFaqAccordionStatus('protect', true);
    LandingPage.verifyFaqAccordionStatus('emergency', false);
  });

  it('verify fourth FAQ accordion', () => {
    cy.tabToElement(`[data-dd-action-name*="settings"]`);
    cy.realPress(`Enter`);
    LandingPage.verifyFaqAccordionStatus('settings', true);
    LandingPage.verifyFaqAccordionStatus('protect', false);

    cy.realPress(`Tab`);
    LandingPage.verifyFaqFocusedLink(
      Data.FAQ_LINK.URL.SETTINGS,
      Data.FAQ_LINK.TEXT.SETTINGS,
    );
  });

  it('verify fifth FAQ accordion', () => {
    cy.tabToElement(`[data-dd-action-name*="pay"]`);
    cy.realPress(`Enter`);
    LandingPage.verifyFaqAccordionStatus('pay', true);
    LandingPage.verifyFaqAccordionStatus('settings', false);

    cy.realPress(`Tab`);
    LandingPage.verifyFaqFocusedLink(
      Data.FAQ_LINK.URL.PAY,
      Data.FAQ_LINK.TEXT.PAY,
    );
  });
});

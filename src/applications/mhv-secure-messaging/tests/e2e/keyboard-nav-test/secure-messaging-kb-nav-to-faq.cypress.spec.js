import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import LandingPage from '../pages/SecureMessagingLandingPage';
import { AXE_CONTEXT, Locators, Data } from '../utils/constants';

describe('SM LANDING PAGE FAQ', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    LandingPage.loadMainPage();
  });

  it('verify accordions are closed', () => {
    cy.get(Locators.FAQ_ACC_ITEM).each(el => {
      cy.wrap(el).should(`have.prop`, `open`, false);
    });

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify "Who can I send messages to" accordion', () => {
    cy.tabToElement(`[data-dd-action-name*="send"]`);
    cy.realPress(`Enter`);
    LandingPage.verifyFaqAccordionStatus('send', true);

    cy.realPress(`Tab`);
    LandingPage.verifyFaqFocusedLink(
      Data.FAQ_LINK.URL.FACILITY,
      Data.FAQ_LINK.TEXT.FACILITY,
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify "What if I have an emergency" accordion', () => {
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

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify "Will VA protect my personal health information" accordion', () => {
    cy.tabToElement(`[data-dd-action-name*="protect"]`);
    cy.realPress(`Enter`);
    LandingPage.verifyFaqAccordionStatus('protect', true);
    LandingPage.verifyFaqAccordionStatus('emergency', false);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify "What happened to my settings" accordion', () => {
    cy.tabToElement(`[data-dd-action-name*="settings"]`);
    cy.realPress(`Enter`);
    LandingPage.verifyFaqAccordionStatus('settings', true);
    LandingPage.verifyFaqAccordionStatus('protect', false);

    cy.realPress(`Tab`);
    LandingPage.verifyFaqFocusedLink(
      Data.FAQ_LINK.URL.SETTINGS,
      Data.FAQ_LINK.TEXT.SETTINGS,
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify "Will I need to pay a copay" accordion', () => {
    cy.tabToElement(`[data-dd-action-name*="pay"]`);
    cy.realPress(`Enter`);
    LandingPage.verifyFaqAccordionStatus('pay', true);
    LandingPage.verifyFaqAccordionStatus('settings', false);

    cy.realPress(`Tab`);
    LandingPage.verifyFaqFocusedLink(
      Data.FAQ_LINK.URL.PAY,
      Data.FAQ_LINK.TEXT.PAY,
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});

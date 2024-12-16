import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import SecureMessagingLandingPage from '../pages/SecureMessagingLandingPage';
import { AXE_CONTEXT } from '../utils/constants';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';

describe('SM LANDING PAGE FAQ', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    SecureMessagingLandingPage.loadMainPage();
  });

  it('verify page content', () => {
    GeneralFunctionsPage.verifyPageHeader('Messages');
    cy.get(`[data-testid="faq-accordion-item"]`).each(el => {
      cy.wrap(el).should(`have.prop`, `open`, false);
    });

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify first FAQ accordion', () => {
    cy.tabToElement(`[data-dd-action-name*="send"]`);
    cy.realPress(`Enter`);
    cy.get(`[data-dd-action-name*="send"]`).should(`have.prop`, `open`, true);
    cy.realPress(`Tab`);
    cy.focused()
      .should(`have.attr`, `href`, `/find-locations/`)
      .and(`have.text`, `Find your nearest VA health facility`);
  });

  it('verify second FAQ accordion', () => {
    cy.tabToElement(`[data-dd-action-name*="emergency"]`);
    cy.realPress(`Enter`);
    cy.get(`[data-dd-action-name*="emergency"]`).should(
      `have.prop`,
      `open`,
      true,
    );
    cy.realPress(`Tab`);
    cy.focused().should(`have.text`, `Connect with the Veterans Crisis Line`);
    cy.realPress(`Tab`);
    cy.focused()
      .should(`have.attr`, `href`, `tel:911`)
      .and(`have.text`, `911`);
    cy.get(`[data-dd-action-name*="send"]`).should(`have.prop`, `open`, false);
  });

  it('verify third FAQ accordion', () => {
    cy.tabToElement(`[data-dd-action-name*="protect"]`);
    cy.realPress(`Enter`);
    cy.get(`[data-dd-action-name*="protect"]`).should(
      `have.prop`,
      `open`,
      true,
    );
    cy.get(`[data-dd-action-name*="emergency"]`).should(
      `have.prop`,
      `open`,
      false,
    );
  });

  it('verify fourth FAQ accordion', () => {
    cy.tabToElement(`[data-dd-action-name*="settings"]`);
    cy.realPress(`Enter`);
    cy.get(`[data-dd-action-name*="settings"]`).should(
      `have.prop`,
      `open`,
      true,
    );
    cy.realPress(`Tab`);
    cy.focused()
      .should(
        `have.attr`,
        `href`,
        `https://mhv-syst.myhealth.va.gov/mhv-portal-web/preferences`,
      )
      .and(`have.text`, `My HealtheVet (opens in new tab)`);
    cy.get(`[data-dd-action-name*="protect"]`).should(
      `have.prop`,
      `open`,
      false,
    );
  });

  it('verify fifth FAQ accordion', () => {
    cy.tabToElement(`[data-dd-action-name*="pay"]`);
    cy.realPress(`Enter`);
    cy.get(`[data-dd-action-name*="pay"]`).should(`have.prop`, `open`, true);
    cy.realPress(`Tab`);
    cy.focused()
      .should(
        `have.attr`,
        `href`,
        `/health-care/pay-copay-bill/dispute-charges/`,
      )
      .and(`have.text`, `Learn how to dispute your VA copay charges`);
    cy.get(`[data-dd-action-name*="settings"]`).should(
      `have.prop`,
      `open`,
      false,
    );
  });
});

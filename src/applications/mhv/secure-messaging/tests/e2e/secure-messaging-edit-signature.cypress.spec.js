import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import { AXE_CONTEXT, Locators } from './utils/constants';

import TestDraftsPage from './pages/TestDraftsPage';

describe('verify deeplinking sending the draft', () => {
  before(() => {
    const site = new SecureMessagingSite();
    const landingPage = new PatientInboxPage();
    site.login();
    landingPage.loadInboxMessages();
    TestDraftsPage.loadMessages();
  });

  it('verify modal', () => {
    TestDraftsPage.loadSingleThread();

    cy.get(Locators.HEADER).should('contain', 'test');
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });
});

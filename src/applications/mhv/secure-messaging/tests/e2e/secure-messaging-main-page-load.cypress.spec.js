import SecureMessagingSite from './sm_site/SecureMessagingSite';
import MainMessagesPage from './pages/MainMessagesPage';

describe('SM main page', () => {
  it('axe check', () => {
    const site = new SecureMessagingSite();
    site.login();
    MainMessagesPage.loadMainPage();

    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });
});

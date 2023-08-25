import SecureMessagingSite from './sm_site/SecureMessagingSite';
import SecureMessagingLandingPage from './pages/SecureMessagingLandingPage';
import { AXE_CONTEXT } from './utils/constants';

describe('SM main page', () => {
  beforeEach(() => {
    const site = new SecureMessagingSite();
    site.login();
    SecureMessagingLandingPage.loadMainPage();
  });

  it('axe check', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });

  it('verify header', () => {
    SecureMessagingLandingPage.verifyHeader();
  });

  // next test have to be updated according to page redesign
  it('verify paragraphs', () => {
    cy.get('h2[class="vads-u-margin-top--1"]').should('be.visible');
    cy.get('.secure-messaging-faq > .vads-u-margin-top--1').should(
      'be.visible',
    );
  });
});

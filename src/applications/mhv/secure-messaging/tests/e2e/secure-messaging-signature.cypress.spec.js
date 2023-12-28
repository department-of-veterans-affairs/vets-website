import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import { AXE_CONTEXT, Locators } from './utils/constants';
import mockThread from './fixtures/thread-response.json';

describe('verify signature', () => {
  const landingPage = new PatientInboxPage();
  const site = new SecureMessagingSite();
  const currentDate = new Date().toISOString();
  beforeEach(() => {
    site.login();
    landingPage.loadInboxMessages();
  });
  it('signature added on composing', () => {
    landingPage.navigateToComposePage();
    landingPage.verifySignature();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });

  // TODO have to be refactored due to page rendering issue
  it.skip('signature added on replying', () => {
    landingPage.loadSingleThread(mockThread, currentDate);

    cy.intercept(
      'GET',
      'my_health/v1/messaging/messages/7192838/thread',
      mockThread,
    ).as('threadAgain');
    cy.intercept('GET', 'my_health/v1/messaging/messages/7192838', {
      data: mockThread.data[0],
    }).as('messageAgain');

    cy.get(Locators.BUTTONS.REPLY).click({
      waitForAnimations: true,
    });
    cy.get(Locators.BUTTONS.CONTINUE).click();

    // landingPage.replyToMessage();
    // landingPage.verifySignature();

    // cy.injectAxe();
    // cy.axeCheck(AXE_CONTEXT, {
    //   rules: {
    //     'aria-required-children': {
    //       enabled: false,
    //     },
    //   },
    // });
  });
});

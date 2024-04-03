import PatientInboxPage from '../pages/PatientInboxPage';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import mockMessages from '../fixtures/messages-response.json';

describe('Secure Messaging Inbox Folder checks', () => {
  const landingPage = new PatientInboxPage();
  const site = new SecureMessagingSite();

  const {
    data: [, secondElement, thirdElement],
    ...rest
  } = mockMessages;

  const mockFilterResults = { data: [secondElement, thirdElement], ...rest };

  beforeEach(() => {
    site.login();
    landingPage.loadInboxMessages();
  });

  it('Verify filter works correctly', () => {
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    landingPage.inputFilterData('test');
    landingPage.filterMessages(mockFilterResults);
    landingPage.verifyFilterResults('test', mockFilterResults);
    cy.get('[data-testid="highlighted-text"]').should(
      'have.class',
      'keyword-highlight',
    );
  });

  it('Verify filter have no result', () => {
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    landingPage.inputFilterData('Functions');
    landingPage.filterMessages(mockFilterResults);
    cy.get('[aria-live="polite"]')
      .last()
      .should('be.focus');
    cy.get('[data-testid="search-messages"] h2')
      .should('be.visible')
      .and('have.text', 'We didn’t find any matches for these filters');
  });
});

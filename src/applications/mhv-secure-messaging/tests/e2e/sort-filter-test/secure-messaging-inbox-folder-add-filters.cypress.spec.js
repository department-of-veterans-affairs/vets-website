import PatientInboxPage from '../pages/PatientInboxPage';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import mockMessages from '../fixtures/messages-response.json';
import mockCategories from '../fixtures/categories-response.json';
import { AXE_CONTEXT } from '../utils/constants';

describe('Secure Messaging Inbox Folder add filter checks', () => {
  const dateRange = [
    'ANY',
    'LAST 3 MONTHS',
    'LAST 6 MONTHS',
    'LAST 12 MONTHS',
    'CUSTOM',
  ];

  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages(mockMessages);
  });

  it('verify filter buttons and dropdowns', () => {
    PatientInboxPage.verifyFilterButtons();

    // verify additional fields not visible
    cy.get(`#content`).should('have.attr', 'hidden');

    PatientInboxPage.clickAdditionalFilterButton();

    PatientInboxPage.verifyFilterCategoryDropdown(
      mockCategories.data.attributes.messageCategoryType,
    );

    PatientInboxPage.verifyFilterdateRangeDropdown(dateRange);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});

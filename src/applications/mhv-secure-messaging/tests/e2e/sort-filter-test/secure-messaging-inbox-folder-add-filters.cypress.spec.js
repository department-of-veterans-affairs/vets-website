import PatientInboxPage from '../pages/PatientInboxPage';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import mockMessages from '../fixtures/messages-response.json';
import { AXE_CONTEXT, Arrays } from '../utils/constants';

describe('Secure Messaging Inbox Folder add filter checks', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages(mockMessages);
  });

  it('verify filter buttons and dropdowns', () => {
    PatientInboxPage.verifyFilterButtons();

    // verify additional fields not visible
    cy.get(`#content`).should('have.attr', 'hidden');

    PatientInboxPage.clickAdditionalFilterButton();

    PatientInboxPage.verifyFilterCategoryDropdown(Arrays.Categories);

    PatientInboxPage.verifyFilterDateRangeDropdown(Arrays.FilterDateRange);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});

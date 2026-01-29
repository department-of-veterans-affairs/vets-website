import PatientInboxPage from '../pages/PatientInboxPage';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import mockMessages from '../fixtures/threads-response.json';
import { AXE_CONTEXT, Arrays } from '../utils/constants';
import FolderLoadPage from '../pages/FolderLoadPage';
import PatientMessageSentPage from '../pages/PatientMessageSentPage';
import PatientFilterPage from '../pages/PatientFilterPage';
import PatientMessageCustomFolderPage from '../pages/PatientMessageCustomFolderPage';

describe('SM ADDITIONAL FILTER ELEMENTS', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages(mockMessages);
  });

  it('verify Inbox folder buttons and dropdowns', () => {
    PatientInboxPage.verifyFilterButtons();

    cy.get(`#content`).should('have.attr', 'hidden');

    PatientFilterPage.openAdditionalFilter();

    PatientFilterPage.verifyFilterCategoryDropdown(Arrays.Categories);

    PatientFilterPage.verifyFilterDateRangeDropdown(Arrays.FilterDateRange);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify Sent folder buttons and dropdowns', () => {
    FolderLoadPage.loadFolders();
    PatientMessageSentPage.loadMessages();

    cy.get(`#content`).should('have.attr', 'hidden');

    PatientFilterPage.openAdditionalFilter();

    PatientFilterPage.verifyFilterCategoryDropdown(Arrays.Categories);

    PatientFilterPage.verifyFilterDateRangeDropdown(Arrays.FilterDateRange);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify Drafts folder buttons and dropdowns', () => {
    FolderLoadPage.loadFolders();
    FolderLoadPage.loadDraftMessages();

    cy.get(`#content`).should('have.attr', 'hidden');

    PatientFilterPage.openAdditionalFilter();

    PatientFilterPage.verifyFilterCategoryDropdown(Arrays.Categories);

    PatientFilterPage.verifyFilterDateRangeDropdown(Arrays.FilterDateRange);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify Trash folder buttons and dropdowns', () => {
    FolderLoadPage.loadFolders();
    FolderLoadPage.loadDeletedMessages();

    cy.get(`#content`).should('have.attr', 'hidden');

    PatientFilterPage.openAdditionalFilter();

    PatientFilterPage.verifyFilterCategoryDropdown(Arrays.Categories);

    PatientFilterPage.verifyFilterDateRangeDropdown(Arrays.FilterDateRange);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify Custom folder buttons and dropdowns', () => {
    FolderLoadPage.loadFolders();
    PatientMessageCustomFolderPage.loadMessages();

    cy.get(`#content`).should('have.attr', 'hidden');

    PatientFilterPage.openAdditionalFilter();

    PatientFilterPage.verifyFilterCategoryDropdown(Arrays.Categories);

    PatientFilterPage.verifyFilterDateRangeDropdown(Arrays.FilterDateRange);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});

import manifest from '../../manifest.json';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import FolderLoadPage from './pages/FolderLoadPage';
import { AXE_CONTEXT } from './utils/constants';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessageSentPage from './pages/PatientMessageSentPage';

describe(manifest.appName, () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
  });

  it('Check the Inbox folder', () => {
    FolderLoadPage.verifyFolderHeaderText('Messages: Inbox');
    FolderLoadPage.verifyBreadCrumbsLength(3);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('Check the Sent folder', () => {
    PatientMessageSentPage.loadMessages();
    FolderLoadPage.verifyFolderHeaderText('Messages: Sent');
    FolderLoadPage.verifyBreadCrumbsLength(3);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('Check the Draft folder', () => {
    FolderLoadPage.loadDraftMessages();
    FolderLoadPage.verifyFolderHeaderText('Messages: Drafts');
    cy.findByTestId('sm-breadcrumbs-back').should('have.text', 'Back');

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('Check the Trash folder', () => {
    FolderLoadPage.loadDeletedMessages();
    FolderLoadPage.verifyFolderHeaderText('Messages: Trash');
    cy.findByTestId('sm-breadcrumbs-back').should('have.text', 'Back');

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});

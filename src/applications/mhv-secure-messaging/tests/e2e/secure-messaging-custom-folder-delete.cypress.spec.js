import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessageCustomFolderPage from './pages/PatientMessageCustomFolderPage';
import { AXE_CONTEXT, Locators, Data } from './utils/constants';
import FolderLoadPage from './pages/FolderLoadPage';
import mockFolders from './fixtures/folder-response.json';

describe('SM DELETE CUSTOM FOLDER', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    FolderLoadPage.loadFolders();
  });

  it('remove non-empty folder', () => {
    PatientMessageCustomFolderPage.loadMessages();
    PatientMessageCustomFolderPage.clickRemoveFolderButton();
    PatientMessageCustomFolderPage.verifyEmptyFolderAlert();
    PatientMessageCustomFolderPage.clickOnCloseIcon();
    PatientMessageCustomFolderPage.verifyFocusOnRemoveFolderButton();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('remove empty folder', () => {
    const emptyThread = { data: [] };
    const deletedFolder = mockFolders.data.filter(
      el => el.attributes.name === `TESTAGAIN`,
    )[0];

    const newData = mockFolders.data.filter(
      el => el.attributes.name !== `TESTAGAIN`,
    );
    const newMeta = {
      ...mockFolders.meta,
      pagination: { ...mockFolders.data.pagination, totalEntries: 5 },
    };
    const updatedFolderList = { data: newData, meta: newMeta };

    PatientMessageCustomFolderPage.loadMessages(emptyThread);
    PatientMessageCustomFolderPage.clickRemoveFolderButton();

    cy.get(Locators.ALERTS.REMOVE_THIS_FOLDER)
      .shadow()
      .find('.va-modal-close', { timeout: 2000 })
      .should(`be.focused`);
    cy.get(Locators.ALERTS.REMOVE_THIS_FOLDER)
      .find(`va-button[text*='keep']`)
      .click();
    cy.get(Locators.BUTTONS.REMOVE_FOLDER).should(`be.focused`);

    PatientMessageCustomFolderPage.clickRemoveFolderButton();

    PatientMessageCustomFolderPage.deleteParticularCustomFolder(
      deletedFolder.attributes.folderId,
      updatedFolderList,
    );

    cy.get(Locators.ALERTS.ALERT_TEXT)
      .should(`be.visible`)
      .and(`include.text`, Data.FOLDER_REMOVED_SUCCESSFULLY);

    cy.get(`[data-testid=${deletedFolder.id}]`).should(`not.exist`);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});

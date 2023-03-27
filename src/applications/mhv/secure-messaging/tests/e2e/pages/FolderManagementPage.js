class FolderManagementPage {
  createANewFolderButton = () => {
    return cy
      .get('[text="Create new folder"]')
      .shadow()
      .find('[type="button"]');
  };

  createFolderTextBox = () => {
    return cy
      .get('[name="folder-name"]')
      .shadow()
      .find('[name="folder-name"]');
  };

  createFolderModalButton = () => {
    return cy
      .get('[text="Create"]')
      .shadow()
      .find('[type="button"]');
  };

  clickAndLoadCustumFolder = (
    folderName,
    folderId,
    folderData,
    folderMessages,
  ) => {
    cy.intercept(
      'GET',
      `/my_health/v1/messaging/folders/${folderId}`,
      folderData,
    ).as('customFolderID');

    cy.intercept(
      'GET',
      `/my_health/v1/messaging/folders/${folderId}/threads*`,
      folderMessages,
    ).as('customFolderMessages');

    cy.contains(folderName).click();
    cy.wait('@customFolderMessages');
  };

  folderConfirmation = () => {
    return cy.get('[class="vads-u-margin-y--0"]');
  };

  verifyDeleteSuccessMessage = () => {
    this.folderConfirmation().should(
      'have.text',
      'Folder was successfully removed.',
    );
  };

  verifyCreateFolderNetworkFailureMessage = () => {
    this.folderConfirmation().should(
      'have.text',
      'Folder could not be created. Try again later. If this problem persists, contact the help desk.',
    );
  };

  verifyCreateFolderSuccessMessage = () => {
    this.folderConfirmation().should(
      'have.text',
      'Folder was successfully created.',
    );
  };
}
export default FolderManagementPage;

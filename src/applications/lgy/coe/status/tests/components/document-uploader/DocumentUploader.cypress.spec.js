import manifest from '../../../manifest.json';

describe(manifest.appName, () => {
  // Skip tests in CI until the app is released.
  // Remove this block when the app has a content page in production.

  const openPage = () => {
    cy.login();
    cy.visit(manifest.rootUrl)
      .injectAxe()
      .axeCheck();

    cy.intercept('GET', '/v0/coe/status', {
      statusCode: 201,
      body: {
        data: {
          attributes: 'pending-upload',
        },
      },
    }).as('pendingUpload');
    cy.wait('@pendingUpload');
  };

  it.skip('Should render on pending-upload status', () => {
    openPage();
    // A status alert should be visible
    cy.findByText(/We need more information from you/i).should('exist');

    cy.findByText(/Select a document to upload/i).should('exist');
  });

  it.skip('Should show an error message when no file is added and the user tries to submit', () => {
    openPage();
    // Find the submit button and click it
    cy.findByText(/Submit Files/i).click();

    cy.findByText(/Please choose a file to upload./i).should('exist');
  });

  it.skip('Should add a single file and show in file list', () => {
    openPage();

    cy.get('#errorable-select-1').select('Statement of service');

    cy.get('input[type="file"]').selectFile(
      'src/applications/lgy/coe/status/tests/components/document-uploader/testPicture.jpeg',
      { force: true },
    );

    cy.findByText(/testPicture.jpeg/i).should('exist');
  });

  it.skip('Should add multiple files and show in file list', () => {
    openPage();

    cy.get('input[type="file"]').selectFile(
      'src/applications/lgy/coe/status/tests/components/document-uploader/testPicture.jpeg',
      { force: true },
    );

    cy.get('#errorable-select-1').select('Statement of service');

    cy.get('input[type="file"]').selectFile(
      'src/applications/lgy/coe/status/tests/components/document-uploader/testPicture.jpeg',
      { force: true },
    );

    cy.findByText(/Statement of service/i).should('exist');
  });

  it.skip('Should delete a file when delete file button is clicked', () => {
    openPage();

    cy.get('#errorable-select-1').select('Statement of service');

    cy.get('input[type="file"]').selectFile(
      'src/applications/lgy/coe/status/tests/components/document-uploader/testPicture.jpeg',
      { force: true },
    );

    cy.findByText(/testPicture.jpeg/i).should('exist');

    cy.findByText(/Delete file/i).click();

    cy.findByText(/testPicture.jpeg/i).should('not.exist');
  });
});

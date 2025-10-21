import TrackClaimsPageV2 from './page-objects/TrackClaimsPageV2';
import claimsList from './fixtures/mocks/lighthouse/claims-list.json';
import claimDetailsOpen from './fixtures/mocks/lighthouse/claim-detail-open.json';
import featureToggleDocumentUploadStatusEnabled from './fixtures/mocks/lighthouse/feature-toggle-document-upload-status-enabled.json';
import { SUBMIT_FILES_FOR_REVIEW_TEXT, SUBMIT_TEXT } from '../../constants';

describe('Type 1 Unknown Upload Errors', () => {
  const setupTest = () => {
    const trackClaimsPage = new TrackClaimsPageV2();
    trackClaimsPage.loadPage(
      claimsList,
      claimDetailsOpen,
      false,
      false,
      featureToggleDocumentUploadStatusEnabled,
    );
    trackClaimsPage.verifyInProgressClaim(true);
    trackClaimsPage.navigateToFilesTab();
    cy.injectAxe();
  };

  const clickSubmitButton = buttonText => {
    cy.get(`va-button[text="${buttonText}"]`)
      .shadow()
      .find('button')
      .click();
  };

  const getFileInputElement = (fileIndex = 0) =>
    cy
      .get('va-file-input-multiple')
      .shadow()
      .find('va-file-input')
      .eq(fileIndex);

  const getFileInput = (fileIndex = 0) =>
    getFileInputElement(fileIndex).shadow();

  const uploadFile = (fileName, fileIndex = 0) => {
    getFileInput(fileIndex)
      .find('input[type="file"]')
      .selectFile({
        contents: Cypress.Buffer.from('test content'),
        fileName,
      });
  };

  const selectDocumentType = (fileIndex, docTypeCode) => {
    getFileInputElement(fileIndex)
      .find('va-select')
      .should('be.visible')
      .shadow()
      .find('select')
      .should('not.be.disabled')
      .should('be.visible')
      .wait(100) // Small wait to ensure stability
      .select(docTypeCode);
  };

  const setupUnknownErrorMock = () => {
    cy.intercept('POST', '/v0/benefits_claims/*/benefits_documents', {
      statusCode: 500,
      body: {
        errors: [
          {
            title: 'Internal Server Error',
            code: '500',
            status: '500',
          },
        ],
      },
    }).as('uploadRequest');
  };

  const uploadFileAndSubmit = () => {
    uploadFile('test-document.txt');
    getFileInputElement(0)
      .find('va-select')
      .should('be.visible');
    selectDocumentType(0, 'L034');
    clickSubmitButton(SUBMIT_FILES_FOR_REVIEW_TEXT);
    cy.wait('@uploadRequest');
  };

  const verifyType1UnknownAlert = () => {
    cy.get('.claims-alert')
      .should('be.visible')
      .and('contain.text', 'We need you to submit files by mail or in person');
  };

  it('should display Type 1 Unknown error alert when upload fails with unknown error', () => {
    setupTest();
    setupUnknownErrorMock();
    uploadFileAndSubmit();
    verifyType1UnknownAlert();
    cy.axeCheck();
  });

  it('should not display Type 1 Unknown error alert for known errors', () => {
    setupTest();

    cy.intercept('POST', '/v0/benefits_claims/*/benefits_documents', {
      statusCode: 422,
      body: {
        errors: [
          {
            title: 'Unprocessable Entity',
            detail: 'DOC_UPLOAD_DUPLICATE',
            code: '422',
            status: '422',
            source: 'BenefitsDocuments::Service',
          },
        ],
      },
    }).as('uploadRequest');

    uploadFile('test-document.txt');
    getFileInputElement(0)
      .find('va-select')
      .should('be.visible');
    selectDocumentType(0, 'L034');

    clickSubmitButton(SUBMIT_FILES_FOR_REVIEW_TEXT);
    cy.wait('@uploadRequest');

    cy.get('.claims-alert').should(
      'not.contain.text',
      'We need you to submit files by mail or in person',
    );

    cy.get('.claims-alert')
      .should('be.visible')
      .and('contain.text', "You've already uploaded");

    cy.axeCheck();
  });

  it('should not display Type 1 Unknown error alert when feature flag is disabled', () => {
    const trackClaimsPage = new TrackClaimsPageV2();
    trackClaimsPage.loadPage(claimsList, claimDetailsOpen);
    trackClaimsPage.verifyInProgressClaim(true);
    trackClaimsPage.navigateToFilesTab();
    cy.injectAxe();

    cy.intercept('POST', '/v0/benefits_claims/*/benefits_documents', {
      statusCode: 500,
      body: {
        errors: [
          {
            title: 'Internal Server Error',
            code: '500',
            status: '500',
          },
        ],
      },
    }).as('uploadRequest');

    uploadFile('test-document.txt');
    getFileInputElement(0)
      .find('va-select')
      .should('be.visible');
    selectDocumentType(0, 'L034');

    clickSubmitButton(SUBMIT_TEXT);
    cy.wait('@uploadRequest');

    cy.get('.claims-alert').should(
      'not.contain.text',
      'We need you to submit files by mail or in person',
    );

    cy.get('.claims-alert')
      .should('be.visible')
      .and('contain.text', 'Error uploading');

    cy.axeCheck();
  });

  it('should persist Type 1 Unknown error alert when navigating between Files and Status tabs', () => {
    setupTest();
    setupUnknownErrorMock();
    uploadFileAndSubmit();
    verifyType1UnknownAlert();

    cy.get('a[href*="/status"]').click();
    verifyType1UnknownAlert();

    cy.get('.claims-alert')
      .find('va-link-action')
      .click();

    cy.url().should('include', '/files');
    cy.get('#other-ways-to-send').should('be.visible');

    cy.axeCheck();
  });

  it('should not display Type 1 Unknown error alert on Overview tab', () => {
    setupTest();
    setupUnknownErrorMock();
    uploadFileAndSubmit();
    verifyType1UnknownAlert();

    cy.get('a[href*="/overview"]').click();
    cy.get('.claims-alert').should('not.exist');

    cy.axeCheck();
  });
});

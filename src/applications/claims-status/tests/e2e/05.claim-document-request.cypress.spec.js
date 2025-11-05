import Timeouts from 'platform/testing/e2e/timeouts';
import TrackClaimsPageV2 from './page-objects/TrackClaimsPageV2';
import claimsList from './fixtures/mocks/lighthouse/claims-list.json';
import claimDetailsOpen from './fixtures/mocks/lighthouse/claim-detail-open.json';
import {
  getFileInputElement,
  uploadFile,
  selectDocumentType,
  setupUnknownErrorMock,
} from './file-upload-helpers';
import { SUBMIT_TEXT, SUBMIT_FILES_FOR_REVIEW_TEXT } from '../../constants';

const setDocumentUploadStatusToggle = enabled => ({
  data: {
    type: 'feature_toggles',
    features: [
      {
        name: 'cst_show_document_upload_status',
        value: enabled,
      },
    ],
  },
});

// Helper function to set up page navigation and intercepts
const setupPageAndIntercepts = featureToggleEnabled => {
  cy.intercept('GET', `/v0/benefits_claims/189685`, claimDetailsOpen).as(
    'detailRequest',
  );
  cy.intercept(
    'GET',
    '/v0/feature_toggles?*',
    setDocumentUploadStatusToggle(featureToggleEnabled),
  );
  cy.intercept('GET', '/v0/benefits_claims', claimsList);

  cy.login();
  cy.visit('/track-claims/your-claims/189685/status');
  cy.get('.claim-title', { timeout: Timeouts.slow }).should('be.visible');

  const trackClaimsPage = new TrackClaimsPageV2();
  trackClaimsPage.verifyPrimaryAlert();
  trackClaimsPage.verifyDocRequestforDefaultPage();
  cy.injectAxe();

  return trackClaimsPage;
};

// Helper function to upload file and select document type
const uploadFileWithDocType = (fileName, fileIndex = 0, docType = 'L034') => {
  uploadFile(fileName, fileIndex);
  getFileInputElement(fileIndex)
    .find('va-select')
    .should('be.visible');
  selectDocumentType(fileIndex, docType);
};

// Helper function to click submit button
const clickSubmitFilesButton = featureToggleEnabled => {
  const buttonText = featureToggleEnabled
    ? SUBMIT_FILES_FOR_REVIEW_TEXT
    : SUBMIT_TEXT;
  cy.get(`.add-files-form va-button[text="${buttonText}"]`)
    .shadow()
    .find('button')
    .click();
};

describe('When feature toggle cst_5103_update_enabled enabled', () => {
  context('A user can view primary alert details from the status tab', () => {
    context('when alert is a Submit Buddy Statement', () => {
      it('Shows primary alert details', () => {
        const trackClaimsPage = new TrackClaimsPageV2();
        trackClaimsPage.loadPage(
          claimsList,
          claimDetailsOpen,
          false,
          false,
          false,
          true,
        );
        trackClaimsPage.verifyInProgressClaim(false);
        trackClaimsPage.verifyPrimaryAlertforSubmitBuddyStatement();
        trackClaimsPage.verifyDocRequestforDefaultPage();
        trackClaimsPage.verifyDocRequestBreadcrumbs();
        trackClaimsPage.submitFilesForReview();
        cy.axeCheck();
      });
    });

    context('when alert is a Automated 5103 Notice', () => {
      it('Shows primary alert details', () => {
        const trackClaimsPage = new TrackClaimsPageV2();
        trackClaimsPage.loadPage(
          claimsList,
          claimDetailsOpen,
          true,
          false,
          false,
          true,
        );
        trackClaimsPage.verifyInProgressClaim(false);
        trackClaimsPage.verifyPrimaryAlertfor5103Notice(false, true);
        trackClaimsPage.verifyDocRequestfor5103Notice();
        trackClaimsPage.verifyDocRequestBreadcrumbs(false, true);
        trackClaimsPage.submitEvidenceWaiver();
        cy.axeCheck();
      });
    });
  });
  context('A user can view primary alert details from the files tab', () => {
    context('when alert is a Submit Buddy Statement', () => {
      it('Shows primary alert details', () => {
        const trackClaimsPage = new TrackClaimsPageV2();
        trackClaimsPage.loadPage(
          claimsList,
          claimDetailsOpen,
          false,
          false,
          false,
          true,
        );
        trackClaimsPage.verifyInProgressClaim(false);
        trackClaimsPage.navigateToFilesTab();
        trackClaimsPage.verifyPrimaryAlertforSubmitBuddyStatement();
        trackClaimsPage.verifyDocRequestforDefaultPage();
        trackClaimsPage.verifyDocRequestBreadcrumbs(true);
        trackClaimsPage.submitFilesForReview();
        cy.axeCheck();
      });
    });

    context('when alert is a Automated 5103 Notice', () => {
      it('Shows primary alert details', () => {
        const trackClaimsPage = new TrackClaimsPageV2();
        trackClaimsPage.loadPage(
          claimsList,
          claimDetailsOpen,
          true,
          false,
          false,
          true,
        );
        trackClaimsPage.verifyInProgressClaim(false);
        trackClaimsPage.navigateToFilesTab();
        trackClaimsPage.verifyPrimaryAlertfor5103Notice(false, true);
        trackClaimsPage.verifyDocRequestfor5103Notice();
        trackClaimsPage.verifyDocRequestBreadcrumbs(true, true);
        trackClaimsPage.submitEvidenceWaiver();
        cy.axeCheck();
      });
    });
  });
});

describe('Type 1 Error Alert', () => {
  context('when cst_show_document_upload_status is disabled', () => {
    it('should display the old alert and not the new type 1 unknown error alert', () => {
      setupPageAndIntercepts(false);
      setupUnknownErrorMock();
      uploadFileWithDocType('test-document.txt');
      clickSubmitFilesButton(false);

      cy.wait('@uploadRequest');
      // Verify new Type 1 unknown error alert is not present
      cy.get('.claims-alert').should(
        'not.contain.text',
        'We need you to submit files by mail or in person',
      );
      // Verify old alert is present
      cy.get('.claims-alert').should('contain.text', 'Error uploading');

      cy.axeCheck();
    });
  });

  context('when cst_show_document_upload_status is enabled', () => {
    it('should display the type 1 unknown error alert for unknown errors', () => {
      setupPageAndIntercepts(true);
      setupUnknownErrorMock();
      uploadFileWithDocType('test-document.txt');
      clickSubmitFilesButton(true);

      cy.wait('@uploadRequest');
      cy.get('#default-page .claims-alert')
        .should('be.visible')
        .and(
          'contain.text',
          'We need you to submit files by mail or in person',
        );

      cy.axeCheck();
    });

    it('should display both the message alert and the type 1 unknown error alert when both error types exist', () => {
      setupPageAndIntercepts(true);

      let uploadCount = 0;
      cy.intercept('POST', '/v0/benefits_claims/*/benefits_documents', req => {
        uploadCount += 1;
        if (uploadCount === 1) {
          // First file: known error (duplicate)
          req.reply({
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
          });
        } else {
          // Second file: unknown error
          req.reply({
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
          });
        }
      }).as('uploadRequests');

      uploadFileWithDocType('test-document-duplicate.txt', 0);
      uploadFileWithDocType('test-document-unknown.txt', 1);
      clickSubmitFilesButton(true);

      cy.wait('@uploadRequests');
      cy.wait('@uploadRequests');
      // Verify both alerts are visible
      cy.get('#default-page .claims-alert').should('have.length.at.least', 2);
      cy.get('#default-page .claims-alert').should(
        'contain.text',
        "You've already uploaded",
      );
      cy.get('#default-page .claims-alert').should(
        'contain.text',
        'We need you to submit files by mail or in person',
      );

      cy.axeCheck();
    });
  });
});

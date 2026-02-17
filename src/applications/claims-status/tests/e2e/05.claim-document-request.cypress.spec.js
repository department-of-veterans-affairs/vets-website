import Timeouts from 'platform/testing/e2e/timeouts';
import TrackClaimsPageV2 from './page-objects/TrackClaimsPageV2';
import claimsList from './fixtures/mocks/lighthouse/claims-list.json';
import claimDetailsOpen from './fixtures/mocks/lighthouse/claim-detail-open.json';
import {
  getFileInputElement,
  uploadFile,
  selectDocumentType,
  setupUnknownErrorMock,
  setupDuplicateErrorMock,
} from './file-upload-helpers';
import { SUBMIT_TEXT, ANCHOR_LINKS } from '../../constants';

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
  getFileInputElement(fileIndex).find('va-select').should('be.visible');
  selectDocumentType(fileIndex, docType);
};

// Helper function to click submit button
const clickSubmitFilesButton = () => {
  cy.get(`.add-files-form va-button[text="${SUBMIT_TEXT}"]`)
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
        cy.injectAxeThenAxeCheck();
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
        cy.injectAxeThenAxeCheck();
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
        cy.injectAxeThenAxeCheck();
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
        cy.injectAxeThenAxeCheck();
      });
    });
  });
});

describe('Document upload', () => {
  describe('Type 1 Error Alert', () => {
    context('when cst_show_document_upload_status is disabled', () => {
      it('should display the old alert and not the new type 1 unknown error alert', () => {
        setupPageAndIntercepts(false);
        setupUnknownErrorMock();
        uploadFileWithDocType('test-document.txt');
        clickSubmitFilesButton();

        cy.wait('@uploadRequest');
        // Verify new Type 1 unknown error alert is not present
        cy.get('.claims-alert').should(
          'not.contain.text',
          'We need you to submit files by mail or in person',
        );
        // Verify old alert is present
        cy.get('.claims-alert').should('contain.text', 'Error uploading');

        cy.injectAxeThenAxeCheck();
      });

      it('should display duplicate error alert with documents-filed anchor link', () => {
        setupPageAndIntercepts(false);
        setupDuplicateErrorMock();
        uploadFileWithDocType('test-document.txt');
        clickSubmitFilesButton();

        cy.wait('@uploadRequest');
        // Verify duplicate error alert is present
        cy.get('.claims-alert').should(
          'contain.text',
          "You've already uploaded test-document.txt",
        );
        // Verify link contains correct anchor for documents-filed
        cy.get('.claims-alert va-link')
          .should('exist')
          .should(
            'have.attr',
            'href',
            `/track-claims/your-claims/189685/files#${ANCHOR_LINKS.documentsFiled}`,
          );

        cy.injectAxeThenAxeCheck();
      });
    });

    context('when cst_show_document_upload_status is enabled', () => {
      it('should display the type 1 unknown error alert for unknown errors', () => {
        setupPageAndIntercepts(true);
        setupUnknownErrorMock();
        uploadFileWithDocType('test-document.txt');
        clickSubmitFilesButton();

        cy.wait('@uploadRequest');
        cy.get('#default-page .claims-alert')
          .should('be.visible')
          .and(
            'contain.text',
            'We need you to submit files by mail or in person',
          );

        cy.injectAxeThenAxeCheck();
      });

      it('should display both the message alert and the type 1 unknown error alert when both error types exist', () => {
        setupPageAndIntercepts(true);

        let uploadCount = 0;
        cy.intercept(
          'POST',
          '/v0/benefits_claims/*/benefits_documents',
          req => {
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
          },
        ).as('uploadRequests');

        uploadFileWithDocType('test-document-duplicate.txt', 0);
        uploadFileWithDocType('test-document-unknown.txt', 1);
        clickSubmitFilesButton();

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

        cy.injectAxeThenAxeCheck();
      });

      it('should display duplicate error alert with files-received anchor link', () => {
        setupPageAndIntercepts(true);
        setupDuplicateErrorMock();
        uploadFileWithDocType('test-document.txt');
        clickSubmitFilesButton();

        cy.wait('@uploadRequest');
        // Verify duplicate error alert is present
        cy.get('#default-page .claims-alert').should(
          'contain.text',
          "You've already uploaded test-document.txt",
        );
        // Verify link contains correct anchor for files-received
        cy.get('#default-page .claims-alert va-link')
          .should('exist')
          .should(
            'have.attr',
            'href',
            `/track-claims/your-claims/189685/files#${ANCHOR_LINKS.filesReceived}`,
          );

        cy.injectAxeThenAxeCheck();
      });
    });
  });

  describe('Successful upload', () => {
    context(
      'when the cst_show_document_upload_status feature flag is enabled',
      () => {
        it('navigates the user to the files tab with hash anchor that leads to the file submissions in progress section', () => {
          const trackClaimsPage = setupPageAndIntercepts(true);
          // Navigate to the document request page
          trackClaimsPage.verifyDocRequestforDefaultPage();
          // Setup successful upload mock
          cy.intercept('POST', '/v0/benefits_claims/*/benefits_documents', {
            statusCode: 200,
            body: {
              data: {
                id: 'test-id',
                type: 'benefits_document',
                attributes: {},
              },
            },
          }).as('uploadRequest');
          // Upload a file
          uploadFileWithDocType('test-document.txt');
          clickSubmitFilesButton();
          // Wait for upload to complete
          cy.wait('@uploadRequest');
          // Verify the user is redirected to the status tab after successful upload
          cy.url().should('include', '/status');
          // Verify the new success alert appears and scope all subsequent checks to it
          cy.get('va-alert[status="success"]')
            .should('exist')
            .within(() => {
              // Verify the anchor link exists with FULL path (not just hash) since we're NOT on Files page
              cy.get('va-link')
                .should(
                  'have.attr',
                  'text',
                  'Check the status of your submission',
                )
                .should(
                  'have.attr',
                  'href',
                  `/track-claims/your-claims/189685/files#${ANCHOR_LINKS.fileSubmissionsInProgress}`,
                );
            });
          // Click the anchor link and verify it navigates to Files page and scrolls to the file submissions in progress section
          cy.get('va-alert[status="success"] va-link')
            .shadow()
            .find('a')
            .click();

          cy.url().should('include', '/files');
          cy.url().should(
            'include',
            `#${ANCHOR_LINKS.fileSubmissionsInProgress}`,
          );
          cy.get(`#${ANCHOR_LINKS.fileSubmissionsInProgress}`).should(
            'be.visible',
          );

          cy.injectAxeThenAxeCheck();
        });
      },
    );
  });
});

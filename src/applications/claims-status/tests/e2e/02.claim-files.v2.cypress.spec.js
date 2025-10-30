import TrackClaimsPageV2 from './page-objects/TrackClaimsPageV2';
import claimsList from './fixtures/mocks/lighthouse/claims-list.json';
import claimDetailsOpen from './fixtures/mocks/lighthouse/claim-detail-open.json';
import claimDetailsOpenNoEvidenceSubmissionsNoSupportingDocs from './fixtures/mocks/lighthouse/claim-detail-open-no-evidence-submissions-no-supporting-docs.json';
import claimDetailsOpenOneEvidenceSubmissionNoSupportingDocs from './fixtures/mocks/lighthouse/claim-detail-open-one-evidence-submission-no-supporting-docs.json';
import claimDetailsOpenNoEvidenceSubmissionsOneSupportingDocs from './fixtures/mocks/lighthouse/claim-detail-open-no-evidence-submissions-one-supporting-docs.json';
import claimDetailsOpenOneEvidenceSubmissionOneSupportingDocs from './fixtures/mocks/lighthouse/claim-detail-open-one-evidence-submission-one-supporting-docs.json';
import featureToggleDocumentUploadStatusEnabled from './fixtures/mocks/lighthouse/feature-toggle-document-upload-status-enabled.json';
import featureToggleDisabled from './fixtures/mocks/lighthouse/feature-toggle-disabled.json';
import claimDetailsOpenManySupportingDocs from './fixtures/mocks/lighthouse/claim-detail-open-many-supporting-docs.json';
import claimDetailsOpenManyEvidenceSubmissions from './fixtures/mocks/lighthouse/claim-detail-open-many-evidence-submissions.json';
import claimDetailsOpenWithFailedSubmissions from './fixtures/mocks/lighthouse/claim-detail-open-with-failed-submissions.json';
import { SUBMIT_FILES_FOR_REVIEW_TEXT, SUBMIT_TEXT } from '../../constants';
import {
  getFileInputElement,
  uploadFile,
  selectDocumentType,
  setupUnknownErrorMock,
} from './claims-status-helpers';

describe('Claim Files Test', () => {
  it('Gets files properly - C30822', () => {
    const trackClaimsPage = new TrackClaimsPageV2();
    trackClaimsPage.loadPage(claimsList, claimDetailsOpen);
    trackClaimsPage.verifyInProgressClaim(false);
    trackClaimsPage.verifyNumberOfFiles(10); // would only show 10 multi-file submissions due to pagination
    trackClaimsPage.verifyClaimEvidence(3, 'Reviewed by VA');
    cy.expandAccordions();
    cy.axeCheck();
  });
});

// If there's a primary alert, a user can see that alert on the files tab and click "details"
describe('Primary Alert Test', () => {
  it('Shows primary alert details', () => {
    const trackClaimsPage = new TrackClaimsPageV2();
    trackClaimsPage.loadPage(claimsList, claimDetailsOpen);
    trackClaimsPage.verifyInProgressClaim(false);
    trackClaimsPage.navigateToFilesTab();
    trackClaimsPage.verifyPrimaryAlert();
    cy.axeCheck();
  });
});

describe('Secondary Alert Test', () => {
  it('Shows secondary alert details', () => {
    const trackClaimsPage = new TrackClaimsPageV2();
    trackClaimsPage.loadPage(claimsList, claimDetailsOpen);
    trackClaimsPage.verifyInProgressClaim(false);
    trackClaimsPage.navigateToFilesTab();
    trackClaimsPage.verifySecondaryAlert();
    cy.axeCheck();
  });
});

describe('Need To Mail Documents Test', () => {
  it('Shows data when a user clicks "Need to mail your documents?"', () => {
    const trackClaimsPage = new TrackClaimsPageV2();
    trackClaimsPage.loadPage(claimsList, claimDetailsOpen);
    trackClaimsPage.verifyInProgressClaim(false);
    trackClaimsPage.navigateToFilesTab();
    trackClaimsPage.verifyNeedToMailDocuments();
    cy.axeCheck();
  });
});

describe('Upload Files Test', () => {
  it('shows the user an error if no file is selected', () => {
    const trackClaimsPage = new TrackClaimsPageV2();
    trackClaimsPage.loadPage(claimsList, claimDetailsOpen);
    trackClaimsPage.verifyInProgressClaim(true);
    trackClaimsPage.navigateToFilesTab();
    trackClaimsPage.submitFilesShowsError();
    cy.axeCheck();
  });

  it('uploads a file', () => {
    const trackClaimsPage = new TrackClaimsPageV2();
    trackClaimsPage.loadPage(claimsList, claimDetailsOpen);
    trackClaimsPage.verifyInProgressClaim(true);
    trackClaimsPage.navigateToFilesTab();
    trackClaimsPage.submitFilesForReview();
    cy.axeCheck();
  });
});

describe('Claim Files Test - Show Document Upload Status Enabled', () => {
  const testCases = [
    {
      description:
        'Shows empty state - No supporting docs and no evidence submissions',
      fixture: claimDetailsOpenNoEvidenceSubmissionsNoSupportingDocs,
      expectedFilesInProgressCount: 0,
      expectedFilesReceivedCount: 0,
    },
    {
      description:
        '1 In progress item - Show populated state for in progress items and empty state for files received',
      fixture: claimDetailsOpenOneEvidenceSubmissionNoSupportingDocs,
      expectedFilesInProgressCount: 1,
      expectedFilesReceivedCount: 0,
    },
    {
      description:
        'No in progress items - Show received state for in progress items and populated state for files received',
      fixture: claimDetailsOpenNoEvidenceSubmissionsOneSupportingDocs,
      expectedFilesInProgressCount: 0,
      expectedFilesReceivedCount: 1,
    },
    {
      description:
        '1 In progress item and one supporting doc - show populated state for both sections',
      fixture: claimDetailsOpenOneEvidenceSubmissionOneSupportingDocs,
      expectedFilesInProgressCount: 1,
      expectedFilesReceivedCount: 1,
    },
  ];

  testCases.forEach(testCase => {
    it(testCase.description, () => {
      const trackClaimsPage = new TrackClaimsPageV2();
      trackClaimsPage.loadPage(
        claimsList,
        testCase.fixture,
        false,
        false,
        featureToggleDocumentUploadStatusEnabled,
      );
      trackClaimsPage.verifyInProgressClaim(false);
      trackClaimsPage.navigateToFilesTab();

      trackClaimsPage.verifyFileSubmissionsInProgress(
        testCase.expectedFilesInProgressCount,
        testCase.expectedFilesReceivedCount,
      );
      trackClaimsPage.verifyFilesReceived(testCase.expectedFilesReceivedCount);
      cy.axeCheck();
    });
  });

  it('uploads a file and shows success alert with anchor link', () => {
    const trackClaimsPage = new TrackClaimsPageV2();
    trackClaimsPage.loadPage(
      claimsList,
      claimDetailsOpen,
      true,
      false,
      featureToggleDocumentUploadStatusEnabled,
    );
    trackClaimsPage.verifyInProgressClaim(true);
    trackClaimsPage.navigateToFilesTab();
    trackClaimsPage.submitFilesForReview(true);

    // Verify the new success alert appears and scope all subsequent checks to it
    cy.get('va-alert[status="success"]')
      .should('exist')
      .within(() => {
        cy.get('h2').should('contain', 'Document submission started on');
        cy.root().should(
          'contain',
          'Your submission is in progress. It can take up to 2 days for us to receive your files.',
        );

        // Verify the anchor link exists and has correct href and text
        cy.get('va-link')
          .should('have.attr', 'text', 'Check the status of your submission')
          .should('have.attr', 'href', '#file-submissions-in-progress');
      });

    // Click the anchor link and verify it navigates to the section
    cy.get('va-alert[status="success"] va-link').click();
    cy.get('#file-submissions-in-progress').should('be.visible');

    cy.axeCheck();
  });

  context('Files Received - more than 5 files received', () => {
    it('shows the user a show more button', () => {
      const trackClaimsPage = new TrackClaimsPageV2();
      trackClaimsPage.loadPage(
        claimsList,
        claimDetailsOpen,
        false,
        false,
        featureToggleDocumentUploadStatusEnabled,
      );
      trackClaimsPage.verifyInProgressClaim(false);
      trackClaimsPage.navigateToFilesTab();
      trackClaimsPage.verifyFilesReceived(5);
      cy.axeCheck();
    });

    it('after clicking show more, the user sees all files', () => {
      const trackClaimsPage = new TrackClaimsPageV2();
      trackClaimsPage.loadPage(
        claimsList,
        claimDetailsOpenManySupportingDocs,
        false,
        false,
        featureToggleDocumentUploadStatusEnabled,
      );
      trackClaimsPage.verifyInProgressClaim(false);
      trackClaimsPage.navigateToFilesTab();
      trackClaimsPage.verifyFilesReceived(5);
      trackClaimsPage.verifyShowMoreFilesReceivedButtonText(
        'Show more received (3)',
      );
      trackClaimsPage.clickShowMoreFilesReceived();
      trackClaimsPage.verifyFilesReceived(8);
      trackClaimsPage.verifyShowMoreFilesReceivedButtonNotExists();
      cy.axeCheck();
    });
  });

  context('Files In Progress - more than 5 in progress items', () => {
    it('shows the user a show more button', () => {
      const trackClaimsPage = new TrackClaimsPageV2();
      trackClaimsPage.loadPage(
        claimsList,
        claimDetailsOpenManyEvidenceSubmissions,
        false,
        false,
        featureToggleDocumentUploadStatusEnabled,
      );
      trackClaimsPage.verifyInProgressClaim(false);
      trackClaimsPage.verifyFileSubmissionsInProgress(5);
      trackClaimsPage.verifyShowMoreFilesInProgressButtonText(
        'Show more in progress (3)',
      );
      cy.axeCheck();
    });

    it('after clicking show more, the user sees all evidence submissions', () => {
      const trackClaimsPage = new TrackClaimsPageV2();
      trackClaimsPage.loadPage(
        claimsList,
        claimDetailsOpenManyEvidenceSubmissions,
        false,
        false,
        featureToggleDocumentUploadStatusEnabled,
      );
      trackClaimsPage.verifyInProgressClaim(false);
      trackClaimsPage.verifyFileSubmissionsInProgress(5);
      trackClaimsPage.verifyShowMoreFilesInProgressButtonText(
        'Show more in progress (3)',
      );
      trackClaimsPage.clickShowMoreFilesInProgress();
      trackClaimsPage.verifyFileSubmissionsInProgress(8);
      trackClaimsPage.verifyShowMoreFilesInProgressButtonNotExists();
      cy.axeCheck();
    });
  });
});

describe('Upload Type 2 Error Alert', () => {
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const twoDaysAgo = new Date(
    Date.now() - 2 * 24 * 60 * 60 * 1000,
  ).toISOString();
  const fiveDaysAgo = new Date(
    Date.now() - 5 * 24 * 60 * 60 * 1000,
  ).toISOString();
  const tenDaysAgo = new Date(
    Date.now() - 10 * 24 * 60 * 60 * 1000,
  ).toISOString();

  context(
    "when the 'cst_show_document_upload_status' feature toggle is disabled",
    () => {
      it('should NOT display the alert', () => {
        const claimDetailsWithTwoFailures = {
          ...claimDetailsOpenWithFailedSubmissions,
          data: {
            ...claimDetailsOpenWithFailedSubmissions.data,
            attributes: {
              ...claimDetailsOpenWithFailedSubmissions.data.attributes,
              evidenceSubmissions: claimDetailsOpenWithFailedSubmissions.data.attributes.evidenceSubmissions
                .slice(0, 2)
                .map(submission => ({
                  ...submission,
                  failedDate: fiveDaysAgo,
                  acknowledgementDate: tomorrow,
                })),
            },
          },
        };
        const trackClaimsPage = new TrackClaimsPageV2();

        trackClaimsPage.loadPage(
          claimsList,
          claimDetailsWithTwoFailures,
          false,
          false,
          featureToggleDisabled,
        );
        trackClaimsPage.verifyInProgressClaim(false);
        trackClaimsPage.navigateToFilesTab();
        // Verify alert is NOT present when toggle is disabled
        trackClaimsPage.verifyUploadType2ErrorAlertNotPresent();
        cy.axeCheck();
      });
    },
  );

  context(
    "when the 'cst_show_document_upload_status' feature toggle is enabled",
    () => {
      it('should display the alert when there are failed submissions within last 30 days', () => {
        const claimDetailsWithTwoFailures = {
          ...claimDetailsOpenWithFailedSubmissions,
          data: {
            ...claimDetailsOpenWithFailedSubmissions.data,
            attributes: {
              ...claimDetailsOpenWithFailedSubmissions.data.attributes,
              evidenceSubmissions: claimDetailsOpenWithFailedSubmissions.data.attributes.evidenceSubmissions
                .slice(0, 2)
                .map((submission, index) => ({
                  ...submission,
                  failedDate: index === 0 ? fiveDaysAgo : twoDaysAgo,
                  acknowledgementDate: tomorrow,
                })),
            },
          },
        };
        const trackClaimsPage = new TrackClaimsPageV2();

        trackClaimsPage.loadPage(
          claimsList,
          claimDetailsWithTwoFailures,
          false,
          false,
          featureToggleDocumentUploadStatusEnabled,
        );
        trackClaimsPage.verifyInProgressClaim(false);
        trackClaimsPage.navigateToFilesTab();
        // Verify alert is visible
        trackClaimsPage.verifyUploadType2ErrorAlert();
        // Verify files are displayed in chronological order (most recent first)
        trackClaimsPage.verifyUploadType2ErrorAlertFileOrder([
          'medical-records.pdf',
          'authorization-form-signed.pdf',
        ]);
        // Verify link to files we couldn't receive page
        trackClaimsPage.verifyUploadType2ErrorAlertLink();
        cy.axeCheck();
      });

      it('should display only first item (sorted by most recent failedDate) and count for remaining failed submissions', () => {
        const claimDetailsWithSortedFailures = {
          ...claimDetailsOpenWithFailedSubmissions,
          data: {
            ...claimDetailsOpenWithFailedSubmissions.data,
            attributes: {
              ...claimDetailsOpenWithFailedSubmissions.data.attributes,
              evidenceSubmissions: [
                {
                  ...claimDetailsOpenWithFailedSubmissions.data.attributes
                    .evidenceSubmissions[0],
                  fileName: 'file-1.pdf',
                  failedDate: twoDaysAgo,
                  acknowledgementDate: tomorrow,
                },
                {
                  ...claimDetailsOpenWithFailedSubmissions.data.attributes
                    .evidenceSubmissions[1],
                  fileName: 'file-3.pdf',
                  failedDate: tenDaysAgo,
                  acknowledgementDate: tomorrow,
                },
                {
                  ...claimDetailsOpenWithFailedSubmissions.data.attributes
                    .evidenceSubmissions[2],
                  fileName: 'file-2.pdf',
                  failedDate: fiveDaysAgo,
                  acknowledgementDate: tomorrow,
                },
              ],
            },
          },
        };

        const trackClaimsPage = new TrackClaimsPageV2();

        trackClaimsPage.loadPage(
          claimsList,
          claimDetailsWithSortedFailures,
          false,
          false,
          featureToggleDocumentUploadStatusEnabled,
        );
        trackClaimsPage.verifyInProgressClaim(false);
        trackClaimsPage.navigateToFilesTab();
        // Verify alert is visible
        trackClaimsPage.verifyUploadType2ErrorAlert();
        // Verify the most recent file (by failedDate) is displayed
        trackClaimsPage.verifyUploadType2ErrorAlertFileName('file-1.pdf');
        // Verify "And X more" message
        trackClaimsPage.verifyUploadType2ErrorAlertMultipleFilesMessage(2);
        cy.axeCheck();
      });
    },
  );
});

describe('Failed Submissions in Progress Empty State', () => {
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const twoDaysAgo = new Date(
    Date.now() - 2 * 24 * 60 * 60 * 1000,
  ).toISOString();

  context('when there are failed uploads', () => {
    it('should show updated empty state message with link when no in-progress items but has failed uploads', () => {
      const claimDetailsWithOnlyFailedUploads = {
        ...claimDetailsOpenWithFailedSubmissions,
        data: {
          ...claimDetailsOpenWithFailedSubmissions.data,
          attributes: {
            ...claimDetailsOpenWithFailedSubmissions.data.attributes,
            evidenceSubmissions: [
              {
                ...claimDetailsOpenWithFailedSubmissions.data.attributes
                  .evidenceSubmissions[0],
                uploadStatus: 'FAILED',
                failedDate: twoDaysAgo,
                acknowledgementDate: tomorrow,
              },
            ],
            supportingDocuments: [],
          },
        },
      };

      const trackClaimsPage = new TrackClaimsPageV2();
      trackClaimsPage.loadPage(
        claimsList,
        claimDetailsWithOnlyFailedUploads,
        false,
        false,
        featureToggleDocumentUploadStatusEnabled,
      );
      trackClaimsPage.verifyInProgressClaim(false);
      trackClaimsPage.navigateToFilesTab();

      // Verify the updated empty state message appears
      cy.get('[data-testid="file-submissions-in-progress"]').within(() => {
        cy.contains(
          'We received your uploaded files, except the ones our system couldn’t accept',
        ).should('exist');

        // Verify anchor link to files we couldn't receive section
        cy.get('va-link')
          .should('have.attr', 'href', '#files-we-couldnt-receive')
          .should('have.attr', 'text', 'Files we couldn’t receive section');
      });

      // Verify the entry point section exists
      cy.get('[data-testid="files-we-couldnt-receive-entry-point"]')
        .should('exist')
        .within(() => {
          cy.contains('Files we couldn’t receive').should('exist');
          cy.contains(
            'Some files you submitted we couldn’t receive because of a problem with our system',
          ).should('exist');

          // Verify the link
          cy.get('va-link')
            .should('have.attr', 'href', '../files-we-couldnt-receive')
            .should(
              'have.attr',
              'text',
              'Learn which files we couldn’t receive and other ways to send your documents',
            );
        });

      cy.axeCheck();
    });
  });

  context('when there are no failed uploads', () => {
    it('should show standard empty state message when all files are received and no failures', () => {
      const trackClaimsPage = new TrackClaimsPageV2();
      trackClaimsPage.loadPage(
        claimsList,
        claimDetailsOpenNoEvidenceSubmissionsOneSupportingDocs,
        false,
        false,
        featureToggleDocumentUploadStatusEnabled,
      );
      trackClaimsPage.verifyInProgressClaim(false);
      trackClaimsPage.navigateToFilesTab();

      // Verify standard empty state message
      cy.get('[data-testid="file-submissions-in-progress"]').within(() => {
        cy.contains('We’ve received all the files you’ve uploaded.').should(
          'exist',
        );
      });
      // Verify the entry point does not exist
      cy.get('[data-testid="files-we-couldnt-receive-entry-point"]').should(
        'not.exist',
      );
      cy.axeCheck();
    });
  });
});

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

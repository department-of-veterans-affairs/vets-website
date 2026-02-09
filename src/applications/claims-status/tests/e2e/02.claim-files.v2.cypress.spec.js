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
import { SUBMIT_TEXT } from '../../constants';
import {
  getFileInputElement,
  uploadFile,
  selectDocumentType,
  setupUnknownErrorMock,
  clickSubmitButton,
} from './file-upload-helpers';
import { assertDataLayerEvent, clearDataLayer } from './analytics-helpers';

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
    cy.injectAxeThenAxeCheck();
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

    it("should navigate to Files We Couldn't Receive page and display error state when API fails", () => {
      // Intercept the failed uploads API call with error
      cy.intercept(
        'GET',
        '/v0/benefits_claims/failed_upload_evidence_submissions',
        {
          statusCode: 500,
          body: { errors: [{ title: 'Internal Server Error' }] },
        },
      ).as('failedUploadsError');

      const trackClaimsPage = new TrackClaimsPageV2();
      trackClaimsPage.loadPage(
        claimsList,
        claimDetailsOpenWithFailedSubmissions,
        false,
        false,
        featureToggleDocumentUploadStatusEnabled,
      );
      trackClaimsPage.verifyInProgressClaim(false);
      trackClaimsPage.navigateToFilesTab();

      // Click link to navigate to Files We Couldn't Receive page
      cy.get('[data-testid="files-we-couldnt-receive-entry-point"] va-link')
        .shadow()
        .find('a')
        .click();

      cy.wait('@failedUploadsError');

      // Verify error state
      cy.get('h1').should('contain.text', 'We encountered a problem');
      cy.get('va-alert[status="warning"]').should('exist');

      // Verify the slotted content (which is in light DOM, not shadow DOM)
      cy.get('va-alert[status="warning"] h2[slot="headline"]').should(
        'contain.text',
        'Your files are temporarily unavailable',
      );
      cy.get('va-alert[status="warning"] p').should(
        'contain.text',
        'having trouble loading your files right now',
      );

      // Verify normal page content is NOT displayed (we expect "We encountered a problem" instead)
      cy.get('h1').should('not.contain.text', 'Files we');
      cy.get('[data-testid="files-not-received-section"]').should('not.exist');

      cy.injectAxeThenAxeCheck();
    });

    it("should navigate to Files We Couldn't Receive page and display empty state when no failed files", () => {
      // Setup feature toggles and API intercepts
      cy.intercept(
        'GET',
        '/v0/feature_toggles?*',
        featureToggleDocumentUploadStatusEnabled,
      );
      cy.intercept('GET', '/v0/benefits_claims', claimsList);
      cy.intercept(
        'GET',
        '/v0/benefits_claims/failed_upload_evidence_submissions',
        {
          statusCode: 200,
          body: { data: [] },
        },
      ).as('failedUploadsEmpty');

      cy.login();
      cy.visit('/track-claims/your-claims/files-we-couldnt-receive');

      cy.wait('@failedUploadsEmpty');

      // Verify page heading
      cy.get('h1').should('contain.text', 'Files we');

      // Verify empty state message
      cy.contains('received all files you submitted online').should('exist');

      // Verify no failed files list
      cy.get('[data-testid="failed-files-list"]').should('not.exist');

      cy.injectAxeThenAxeCheck();
    });

    it("should navigate to Files We Couldn't Receive page and display list of failed files", () => {
      const mockFailedFiles = [
        {
          id: 1,
          fileName: 'test-document-1.pdf',
          trackedItemDisplayName: '21-4142',
          failedDate: '2025-01-15T10:35:00.000Z',
          documentType: 'VA Form 21-4142',
          claimId: '123',
          trackedItemId: 1,
        },
        {
          id: 2,
          fileName: 'test-document-2.pdf',
          trackedItemDisplayName: null,
          failedDate: '2025-01-20T14:20:00.000Z',
          documentType: 'Other Correspondence',
          claimId: '123',
          trackedItemId: null,
        },
      ];

      // Intercept the failed uploads API call with data
      cy.intercept(
        'GET',
        '/v0/benefits_claims/failed_upload_evidence_submissions',
        {
          statusCode: 200,
          body: { data: mockFailedFiles },
        },
      ).as('failedUploadsWithData');

      const trackClaimsPage = new TrackClaimsPageV2();
      trackClaimsPage.loadPage(
        claimsList,
        claimDetailsOpenWithFailedSubmissions,
        false,
        false,
        featureToggleDocumentUploadStatusEnabled,
      );
      trackClaimsPage.verifyInProgressClaim(false);
      trackClaimsPage.navigateToFilesTab();

      // Click link to navigate to Files We Couldn't Receive page
      cy.get('[data-testid="files-we-couldnt-receive-entry-point"] va-link')
        .shadow()
        .find('a')
        .click();

      cy.wait('@failedUploadsWithData');

      // Verify page heading
      cy.get('h1').should('contain.text', 'Files we');

      // Verify instructions
      cy.contains('receive files you submitted online').should('exist');

      // Verify failed files list exists
      cy.get('[data-testid="failed-files-list"]').should('exist');

      // Verify card for tracked item (with trackedItemId)
      cy.get('[data-testid="failed-file-1"]').within(() => {
        cy.contains('test-document-1.pdf').should('exist');
        cy.contains('Document type: VA Form 21-4142').should('exist');
        cy.contains('Submitted in response to request: 21-4142').should(
          'exist',
        );
        cy.contains('Date failed:').should('exist');
      });

      // Verify card for additional evidence (without trackedItemId)
      cy.get('[data-testid="failed-file-2"]').within(() => {
        cy.contains('test-document-2.pdf').should('exist');
        cy.contains('Document type: Other Correspondence').should('exist');
        cy.contains('You submitted this file as additional evidence.').should(
          'exist',
        );
        cy.contains('Date failed:').should('exist');
      });

      // ignore heading order violation (see [Design](https://www.figma.com/design/m1Xt8XjVDjZIbliCYcCKpE/Document-status?node-id=10278-153082&t=Xo9NNjbMT73BjVWx-4))
      // See decision thread: https://www.figma.com/design/m1Xt8XjVDjZIbliCYcCKpE?node-id=10278-153120#1554363796
      cy.injectAxeThenAxeCheck('main', {
        rules: {
          'heading-order': { enabled: false },
        },
      });
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

  const uploadFileAndSubmit = () => {
    uploadFile('test-document.txt');
    getFileInputElement(0)
      .find('va-select')
      .should('be.visible');
    selectDocumentType(0, 'L034');
    clickSubmitButton(SUBMIT_TEXT);
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

    clickSubmitButton(SUBMIT_TEXT);
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

    cy.get('#tabStatus').click();

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

describe('Google Analytics', () => {
  const setupAnalyticsTest = () => {
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
  };

  const uploadFileAndSelectType = (
    fileName = 'test-document.txt',
    docTypeCode = 'L034',
    fileIndex = 0,
    force = false,
  ) => {
    uploadFile(fileName, fileIndex, force);
    selectDocumentType(fileIndex, docTypeCode);
  };

  it('should record claims-upload-start event when file upload begins', () => {
    setupAnalyticsTest();
    uploadFileAndSelectType();
    clearDataLayer();
    clickSubmitButton(SUBMIT_TEXT);

    assertDataLayerEvent('claims-upload-start', [
      'event',
      'api-name',
      'api-status',
      'error-key',
      'upload-cancel-file-count',
      'upload-fail-alert-count',
      'upload-fail-file-count',
      'upload-file-count',
      'upload-retry',
      'upload-retry-file-count',
      'upload-success-file-count',
    ]);

    cy.injectAxeThenAxeCheck();
  });

  it('should record claims-upload-success event on successful upload', () => {
    setupAnalyticsTest();

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

    uploadFileAndSelectType();
    clearDataLayer();
    clickSubmitButton(SUBMIT_TEXT);

    cy.wait('@uploadRequest');
    // Wait for upload modal to close before running axe check
    cy.get('#upload-status').should('not.be.visible');

    assertDataLayerEvent('claims-upload-success', [
      'event',
      'api-name',
      'api-status',
      'error-key',
      'upload-cancel-file-count',
      'upload-fail-alert-count',
      'upload-fail-file-count',
      'upload-file-count',
      'upload-retry',
      'upload-retry-file-count',
      'upload-success-file-count',
    ]);

    cy.injectAxeThenAxeCheck();
  });

  it('should record claims-upload-failure event on Type 1 upload failure', () => {
    setupAnalyticsTest();
    setupUnknownErrorMock();
    uploadFileAndSelectType();
    clearDataLayer();
    clickSubmitButton(SUBMIT_TEXT);

    cy.wait('@uploadRequest');
    // Wait for upload modal to close before running axe check
    cy.get('#upload-status').should('not.be.visible');

    assertDataLayerEvent('claims-upload-failure', [
      'event',
      'api-name',
      'api-status',
      'error-key',
      'upload-cancel-file-count',
      'upload-fail-alert-count',
      'upload-fail-file-count',
      'upload-file-count',
      'upload-retry',
      'upload-retry-file-count',
      'upload-success-file-count',
    ]);

    cy.injectAxeThenAxeCheck();
  });

  it('should include retry count when uploading the same file multiple times', () => {
    setupAnalyticsTest();
    setupUnknownErrorMock();
    // First upload attempt
    uploadFileAndSelectType();
    clearDataLayer();
    clickSubmitButton(SUBMIT_TEXT);

    cy.wait('@uploadRequest');

    // Verify failure event fired on first attempt (retryable)
    assertDataLayerEvent('claims-upload-failure', [
      'event',
      'api-name',
      'api-status',
      'error-key',
      'upload-cancel-file-count',
      'upload-fail-alert-count',
      'upload-fail-file-count',
      'upload-file-count',
      'upload-retry',
      'upload-retry-file-count',
      'upload-success-file-count',
    ]);

    // Wait for error alert to appear
    cy.get('va-alert[status="error"]').should('be.visible');
    // Wait for select to be enabled and ready
    getFileInputElement(0)
      .find('va-select')
      .shadow()
      .find('select')
      .should('not.be.disabled')
      .and('be.visible');

    // Retry with same file
    clearDataLayer();
    uploadFileAndSelectType('test-document.txt', 'L034', 0, true); // force: true for retry
    clickSubmitButton(SUBMIT_TEXT);

    cy.wait('@uploadRequest');

    // Verify retry event fired (retryable)
    assertDataLayerEvent('claims-upload-start', [
      'event',
      'api-name',
      'api-status',
      'error-key',
      'upload-cancel-file-count',
      'upload-fail-alert-count',
      'upload-fail-file-count',
      'upload-file-count',
      'upload-retry',
      'upload-retry-file-count',
      'upload-success-file-count',
    ]);

    cy.injectAxeThenAxeCheck();
  });
});

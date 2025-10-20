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
                .map(submission => ({
                  ...submission,
                  failedDate: twoDaysAgo,
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
        // Verify file names are displayed
        trackClaimsPage.verifyUploadType2ErrorAlertFileName(
          'authorization-form-signed.pdf',
        );
        trackClaimsPage.verifyUploadType2ErrorAlertFileName(
          'medical-records-dr-smith.pdf',
        );
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

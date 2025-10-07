import TrackClaimsPageV2 from './page-objects/TrackClaimsPageV2';
import claimsList from './fixtures/mocks/lighthouse/claims-list.json';
import claimDetailsOpen from './fixtures/mocks/lighthouse/claim-detail-open.json';
import claimDetailsOpenNoEvidenceSubmissionsNoSupportingDocs from './fixtures/mocks/lighthouse/claim-detail-open-no-evidence-submissions-no-supporting-docs.json';
import claimDetailsOpenOneEvidenceSubmissionNoSupportingDocs from './fixtures/mocks/lighthouse/claim-detail-open-one-evidence-submission-no-supporting-docs.json';
import claimDetailsOpenNoEvidenceSubmissionsOneSupportingDocs from './fixtures/mocks/lighthouse/claim-detail-open-no-evidence-submissions-one-supporting-docs.json';
import claimDetailsOpenOneEvidenceSubmissionOneSupportingDocs from './fixtures/mocks/lighthouse/claim-detail-open-one-evidence-submission-one-supporting-docs.json';
import featureToggleDocumentUploadStatusEnabled from './fixtures/mocks/lighthouse/feature-toggle-document-upload-status-enabled.json';

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
});

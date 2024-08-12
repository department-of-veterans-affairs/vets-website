import TrackClaimsPageV2 from './page-objects/TrackClaimsPageV2';
import claimsList from './fixtures/mocks/lighthouse/claims-list.json';
import claimDetailsOpen from './fixtures/mocks/lighthouse/claim-detail-open.json';

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

describe('Need To Mail Files Test', () => {
  it('Shows data when a user clicks "Need To Mail Your Files?"', () => {
    const trackClaimsPage = new TrackClaimsPageV2();
    trackClaimsPage.loadPage(claimsList, claimDetailsOpen);
    trackClaimsPage.verifyInProgressClaim(false);
    trackClaimsPage.navigateToFilesTab();
    trackClaimsPage.verifyNeedToMailFiles();
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

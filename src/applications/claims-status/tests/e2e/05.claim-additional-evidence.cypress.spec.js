import TrackClaimsPage from './page-objects/TrackClaimsPage';
import claimsList from './fixtures/mocks/lighthouse/claims-list.json';
import claimDetail from './fixtures/mocks/lighthouse/claim-detail.json';

describe('Claim Additional Evidence Test', () => {
  it('Submits files - C30829', () => {
    const trackClaimsPage = new TrackClaimsPage();
    trackClaimsPage.loadPage(claimsList, claimDetail);
    trackClaimsPage.verifyInProgressClaim(false);
    trackClaimsPage.verifyNumberOfTrackedItems(3);
    trackClaimsPage.verifyNumberOfFiles(15);
    cy.expandAccordions();
    cy.axeCheck();
    trackClaimsPage.submitFilesForReview();
    cy.expandAccordions();
    cy.axeCheck();
  });
});

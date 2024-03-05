import TrackClaimsPage from './page-objects/TrackClaimsPage';
import claimsList from './fixtures/mocks/lighthouse/claims-list.json';
import claimDetail from './fixtures/mocks/lighthouse/claim-detail.json';

describe('Claims status test', () => {
  it('Shows the correct status for the claim - C30820', () => {
    const trackClaimsPage = new TrackClaimsPage();
    trackClaimsPage.loadPage(claimsList, claimDetail);
    trackClaimsPage.verifyInProgressClaim(false);
    trackClaimsPage.verifyCompletedSteps(5);
    trackClaimsPage.verifyClosedClaim();
    trackClaimsPage.axeCheckClaimDetails();
    trackClaimsPage.verifyItemsNeedAttention(2);
    cy.expandAccordions();
    cy.axeCheck();
  });
});

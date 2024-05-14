import TrackClaimsPage from './page-objects/TrackClaimsPage';
import claimsList from './fixtures/mocks/lighthouse/claims-list.json';
import claimDetails from './fixtures/mocks/lighthouse/claim-detail.json';

describe('Ask VA Claim Test', () => {
  it('Submits the form - C30827', () => {
    const trackClaimsPage = new TrackClaimsPage();
    trackClaimsPage.loadPage(claimsList, claimDetails, true);
    trackClaimsPage.verifyInProgressClaim(false);
    trackClaimsPage.verifyNumberOfTrackedItems(3);
    trackClaimsPage.verifyNumberOfFiles(15);
    trackClaimsPage.askForClaimDecision();
    cy.expandAccordions();
    cy.axeCheck();
  });
});

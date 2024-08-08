import TrackClaimsPage from './page-objects/TrackClaimsPage';
import claimsList from './fixtures/mocks/lighthouse/claims-list.json';
import claimDetails from './fixtures/mocks/lighthouse/claim-detail-closed.json';

describe('Claims status test', () => {
  it('Shows the correct status for the claim - C30820', () => {
    const trackClaimsPage = new TrackClaimsPage();
    trackClaimsPage.loadPage(claimsList, claimDetails);
    trackClaimsPage.verifyInProgressClaim(false);
    cy.axeCheck();
  });
});

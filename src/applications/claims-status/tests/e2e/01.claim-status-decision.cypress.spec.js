import TrackClaimsPage from './page-objects/TrackClaimsPage';
import claimsList from './fixtures/mocks/lighthouse/claims-list.json';
import claimDetail from './fixtures/mocks/lighthouse/claim-detail-closed.json';

describe('Claim Status Decision', () => {
  it('Checks that a decision is ready - C30700', () => {
    const trackClaimsPage = new TrackClaimsPage();
    trackClaimsPage.loadPage(claimsList, claimDetail);
    trackClaimsPage.verifyReadyClaim();
    cy.expandAccordions();
    cy.axeCheck();
  });
});

import TrackClaimsPage from './page-objects/TrackClaimsPage';
import claimsList from './fixtures/mocks/lighthouse/claims-list.json';
import claimDetail from './fixtures/mocks/lighthouse/claim-detail.json';

describe('Claim Details Test', () => {
  it('Shows the correct details - C30825', () => {
    const trackClaimsPage = new TrackClaimsPage();
    trackClaimsPage.loadPage(claimsList, claimDetail);
    trackClaimsPage.checkClaimsContent();
    trackClaimsPage.claimDetailsTab();
    trackClaimsPage.verifyClaimDetails();
    cy.expandAccordions();
    cy.axeCheck();
  });
});

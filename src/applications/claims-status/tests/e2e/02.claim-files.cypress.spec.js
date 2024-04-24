import TrackClaimsPage from './page-objects/TrackClaimsPage';
import claimsList from './fixtures/mocks/lighthouse/claims-list.json';
import claimDetail from './fixtures/mocks/lighthouse/claim-detail.json';

describe('Claim Files Test', () => {
  it('Gets files properly - C30822', () => {
    const trackClaimsPage = new TrackClaimsPage();
    trackClaimsPage.loadPage(claimsList, claimDetail);
    trackClaimsPage.verifyInProgressClaim(false);
    trackClaimsPage.verifyNumberOfFiles(15);
    trackClaimsPage.verifyClaimEvidence(4, 'Reviewed by VA');
    trackClaimsPage.verifyClaimEvidence(5, 'Submitted');
    cy.expandAccordions();
    cy.axeCheck();
  });
});

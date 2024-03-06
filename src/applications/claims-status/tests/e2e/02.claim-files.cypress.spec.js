import TrackClaimsPage from './page-objects/TrackClaimsPage';
import claimsList from './fixtures/mocks/lighthouse/claims-list.json';

let mockDetails = {};

beforeEach(() => {
  cy.initClaimDetailMocks(false, true, false, 8).then(data => {
    mockDetails = data;
  });
});

describe('Claim Files Test', () => {
  it('Gets files properly - C30822', () => {
    const trackClaimsPage = new TrackClaimsPage();
    trackClaimsPage.loadPage(claimsList, mockDetails);
    trackClaimsPage.verifyInProgressClaim(false);
    trackClaimsPage.verifyNumberOfFiles(3);
    trackClaimsPage.verifyClaimEvidence(2, 'Reviewed by VA');
    trackClaimsPage.verifyClaimEvidence(4, 'Submitted');
    cy.expandAccordions();
    cy.axeCheck();
  });
});

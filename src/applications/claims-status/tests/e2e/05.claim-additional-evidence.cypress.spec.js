import TrackClaimsPage from './page-objects/TrackClaimsPage';
import claimsList from './fixtures/mocks/lighthouse/claims-list.json';

let mockDetails = {};

beforeEach(() => {
  cy.initClaimDetailMocks(false, true, false, 8).then(data => {
    mockDetails = data;
  });
});

describe('Claim Additional Evidence Test', () => {
  it('Submits files - C30829', () => {
    const trackClaimsPage = new TrackClaimsPage();
    trackClaimsPage.loadPage(claimsList, mockDetails);
    trackClaimsPage.verifyInProgressClaim(false);
    trackClaimsPage.verifyNumberOfFiles(3);
    cy.expandAccordions();
    cy.axeCheck();
    trackClaimsPage.submitFilesForReview();
    cy.expandAccordions();
    cy.axeCheck();
  });
});

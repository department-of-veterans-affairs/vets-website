import TrackClaimsPage from './page-objects/TrackClaimsPage';
import claimsList from './fixtures/mocks/claims-list.json';

let mockDetails = {};

beforeEach(() => {
  cy.initClaimDetailMocks(false, true, false, 3).then(data => {
    mockDetails = data;
  });
});

describe('Ask VA Claim Test', () => {
  it('Submits the form', () => {
    const trackClaimsPage = new TrackClaimsPage();
    trackClaimsPage.loadPage(claimsList, mockDetails, true);
    trackClaimsPage.verifyInProgressClaim(false);
    trackClaimsPage.verifyNumberOfFiles(3);
    trackClaimsPage.askForClaimDecision();
    cy.expandAccordions();
    cy.axeCheck();
  });
});

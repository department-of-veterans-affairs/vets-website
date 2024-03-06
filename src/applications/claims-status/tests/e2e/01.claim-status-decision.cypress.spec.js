import TrackClaimsPage from './page-objects/TrackClaimsPage';
import claimsList from './fixtures/mocks/lighthouse/claims-list.json';

let mockDetails = {};

beforeEach(() => {
  cy.initClaimDetailMocks(true, true, false, null).then(data => {
    mockDetails = data;
  });
});

describe('Claim Status Decision', () => {
  it('Checks that a decision is ready - C30700', () => {
    const trackClaimsPage = new TrackClaimsPage();
    trackClaimsPage.loadPage(claimsList, mockDetails);
    trackClaimsPage.verifyReadyClaim();
    cy.expandAccordions();
    cy.axeCheck();
  });
});

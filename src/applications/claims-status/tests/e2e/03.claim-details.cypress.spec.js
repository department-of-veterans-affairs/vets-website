import TrackClaimsPage from './page-objects/TrackClaimsPage';
import claimsList from './fixtures/mocks/lighthouse/claims-list.json';

let mockDetails = {};

beforeEach(() => {
  cy.initClaimDetailMocks(false, true, false, 8).then(data => {
    mockDetails = data;
  });
});

describe('Claim Details Test', () => {
  it('Shows the correct details - C30825', () => {
    const trackClaimsPage = new TrackClaimsPage();
    trackClaimsPage.loadPage(claimsList, mockDetails);
    trackClaimsPage.checkClaimsContent();
    trackClaimsPage.claimDetailsTab();
    trackClaimsPage.verifyClaimDetails();
    cy.expandAccordions();
    cy.axeCheck();
  });
});

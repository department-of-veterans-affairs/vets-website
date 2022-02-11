import TrackClaimsPage from './page-objects/TrackClaimsPage';
import claimsList from './fixtures/mocks/claims-list.json';

let mockDetails = {};

beforeEach(() => {
  cy.initClaimDetailMocks(false, true, false, 8).then(data => {
    mockDetails = data;
  });
});

describe('Claim Details Test', () => {
  it('Shows the correct details', () => {
    const trackClaimsPage = new TrackClaimsPage();
    trackClaimsPage.loadPage(claimsList, mockDetails);
    trackClaimsPage.checkClaimsContent();
    trackClaimsPage.claimDetailsTab();
    trackClaimsPage.verifyClaimDetails();
  });
});
